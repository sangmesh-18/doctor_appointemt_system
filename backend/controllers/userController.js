import validator from 'validator';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary'
import doctorMOdel from '../models/doctorModel.js';
import appointModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import Razorpay from 'razorpay';

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    if(await userModel.findOne({email})){
      return res.json({
        message: 'User already exists',
        success: false,
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email',
        success: false,
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password should be at least 8 characters long',
        success: false,
      });
    }

    // Hash the password
    const passwordHased = await bcrypt.hash(password, 10);

    // Create user data
    const userData = {
      email,
      password: passwordHased,
      name,
    };

    // Save the new user to the database
    const newUser = new userModel(userData);
    await newUser.save();

    // Generate JWT token - use 'id' to match login and auth middleware
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token if the password matches
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    return res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  try{
    const {userId}=req.body;
    console.log(userId);
    const userData=await userModel.findById(userId).select('-password');
    return res.json({
      success:true,
      userData
    })

  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProfile= async(req,res)=>{
  try{
    const{userId,name,phone,address,dob,gender}=req.body;
    console.log(userId);
    const imageFile=req.file;
    if(!name || !phone ||  !gender || !dob){
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }
    await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),gender,dob});
    if(imageFile){
      const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type: 'image'});
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId,{image: imageUrl});
    }
    res.json({
      success: true,
      message: 'Profile updated successfully'
    })
    
  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    console.log(docId);

    const docData = await doctorMOdel.findById(docId).select('-password');
    if (!docData || !docData.available) {
      return res.json({ message: 'Doctor not available', success: false });
    }

    let slots_booked = docData.slots_booked || {};
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }

    if (slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ message: 'Slot already booked', success: false });
    }

    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select('-password');
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotDate,
      slotTime,
      date: Date.now(),
      amount: docData.fees,
    };

    const newAppointment = new appointModel(appointmentData);
    await newAppointment.save();
    await doctorMOdel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const listAppointment = async(req,res)=>{
  try{
    const {userId}=req.body;
    const appointments= await appointModel.find({userId});
    res.json({
      success:true,
      appointments
    })

  }catch(err){
    console.error(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        message: 'Appointment not found',
        success: false,
      });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        message: 'Unauthorized action',
        success: false,
      });
    }

    await appointModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorMOdel.findById(docId);
    if (!doctorData) {
      return res.status(404).json({
        message: 'Doctor not found',
        success: false,
      });
    }

    let slots_booked = doctorData.slots_booked || {};
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorMOdel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Razorpay instance
const razorPayInstance =new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET

})
// API make payment using razorpay

const paymentRazorpay = async(req,res)=>{
  try{
  const {appointmentId}=req.body;
  const appointmentData=await appointModel.findById(appointmentId);

  if(!appointmentData || appointmentData.cancelled){
    return res.json({
      message: 'Invalid appointment or appointment has been cancelled',
      success: false,
    });
  }

  // creating options for razorpay payment

  const options={
    amount: appointmentData.amount*100,
    currency: process.env.CURRENCY,
    receipt:appointmentId,
  }
 
  // creating an order
  const order= await razorPayInstance.orders.create(options);
  res.json({
    success: true,
    order,
    message: 'Payment initiated successfully',
  })
 }catch(err){
   console.error(err);
   res.json({
     success: false,
     message: err.message,
   });
 }

}


// API to verify razorpay payment
const verifyRazorpay = async(req,res)=>{
  try{
    const { razorpay_order_id }=req.body;
    const orderInfo= await razorPayInstance.orders.fetch(razorpay_order_id)

   // console.log(orderInfo);
    if(orderInfo.status === 'paid'){
      await appointModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
      return res.json({
        success: true,
        message: 'Payment successful',
      })

    }
    else{
      return res.json({
        success: true,
        message: 'Payment failed',
      })
    }

  }catch(err){
    console.error(err);
    res.json({
      success: false,
      message: err.message,
    });}

}

export { registerUser, loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay };

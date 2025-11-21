import validator from "validator";
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'
import doctorMOdel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


const addDoctor=async (req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;
        const imageFile = req.file
       
        

        //console.log({name,email,password,speciality,degree,experience,about,fees,address},imageFile)
        if(!name || !email || !password || !speciality || !degree || !experience || !about|| !fees || !address){
            return res.status(400).json({
                message: 'All fields are required',
                success:false
            });
        };

        if(!validator.isEmail(email)){
            return res.status(400).json({
                message: 'please enter a valid email',
                success:false
            });

        }

        if(password.length <8 ){
            return res.status(400).json({
                message: 'please enter strong password',
                success:false
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const imageUpload =await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        if (!imageFile || !imageFile.path) {
            console.error('imageFile is undefined or does not have a path property');
            return; // or handle the error appropriately
        }
        const imageUrl = imageUpload.secure_url;

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()

        }
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.status(200).json({
            message:"doctor added successfully",
            success:true
        })



    }catch(err){
        console.log(err);
    }

}
const loginAdmin =async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password=== process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET_KEY)
            res.json({
                success:true,
                token
            })

        }
        else{
            return res.status(401).json({
                message:"Invalid credentials. Please check your email and password.",
                success:false
            })
        }

    }catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});
    }
    
}

const signUpAdmin = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const adminData={
            name,
            email,
            password:hashedPassword
        }
        const newAdmin = new userModel(adminData);
        await newAdmin.save();
        res.json({success:true,message:"Admin signed up successfully"});
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

const allDoctors = async (req,res)=>{
    try{
        const doctors= await doctorMOdel.find({}).select('-password');
        //console.log(doctors);
        res.json({success:true,doctors});

    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

const doctorList = async(req,res)=>{
    try{
        const doctors= await doctorMOdel.find().select(['-password','-email']);
        res.json({
            success:true,
            doctors

        })


    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

// API to get all appointments list
const appointmentsAdmin=async(req,res)=>{
    try{
        const appointments= await appointModel.find({});
        res.json({
            success:true,
            appointments
        });

    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

// API to appointment cancel
const appointmentCancel = async (req, res) => {
    try {
      const {  appointmentId } = req.body;
  
      const appointmentData = await appointModel.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({
          message: 'Appointment not found',
          success: false,
        });
      }
  
      
  
      await appointModel.findByIdAndUpdate(appointmentId, { cancelled: true });
  
      const { docId, slotDate, slotTime } = appointmentData;
  
      const doctorData = await doctorMOdel.findById(docId);
      if (!doctorData) {
        return res.json({
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
      res.json({
        success: false,
        message: err.message,
      });
    }
  };

  // API to get dashboard data for admin 

  const adminDashBoard= async (req, res) => {
    try{
        const doctors = await doctorMOdel.find({});
        const users = await userModel.find({})
        const appointments = await appointModel.find({});

        const dashData={
            doctors:doctors.length,
            patients:users.length,
            appointments:appointments.length,
            latestAppointments:appointments.reverse().slice(0,5)

        }
        return res.json({
            success:true,
            dashData
        })
       

    }catch (err) {
        console.error(err);
        res.json({
          success: false,
          message: err.message,
        });
      }
  };
export {addDoctor,loginAdmin,allDoctors,doctorList,appointmentsAdmin,appointmentCancel,adminDashBoard,signUpAdmin}
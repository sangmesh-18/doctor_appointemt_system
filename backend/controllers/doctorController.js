import doctorMOdel from "../models/doctorModel.js";
import appointModel from "../models/appointmentModel.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

 const changeAvailablity = async(req,res)=>{
    try{
        const {docId}=req.body;
        const docData = await doctorMOdel.findById(docId);
        await doctorMOdel.findByIdAndUpdate(docId,{available:!docData.available});
        res.json({
            success:true,
            message:"Availability Changed"
        })

    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
 }
 
 
 // APi for doctor login 

const loginDoctor=async(req,res)=>{
    try{
        const {email,password} = req.body;
        const doctor= await doctorMOdel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid Email"})

        }
        const isMatch=await bcrypt.compare(password,doctor.password) 
        if(isMatch){
            const token =jwt.sign({id:doctor._id},process.env.JWT_SECRET_KEY)
            res.json({success:true,token})
        }
        else{
            return res.json({success:false,message:"Invalid password"})
        }
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
// APi to get doctor appointment for doctor panel
const appointmentsDoctor = async(req, res)=>{
    try{
        const {docId}=req.body;
        const appointments= await appointModel.find({docId});
        return res.json({
            success:true,
            appointments
        })
        

    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }

}

//API to mark Appointment completeed for doctor panel

const appointmentComplete = async(req,res)=>{
    try{
        const {docId,appointmentId}=req.body;
        const appointmentData = await appointModel.findByIdAndUpdate(appointmentId)
        if(appointmentData && appointmentData.docId === docId){
           await appointModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
           return res.json({
            success:true,
            message:"Appointment  completed"
 
           })
        }
        else{
            return res.json({
                success:false,
                message:"Unauthorized"
            })
        }
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
} 

//API to mark Appointment cancel for doctor panel
const appointmentCancel = async(req,res)=>{
    try{
        const {docId,appointmentId}=req.body;
        const appointmentData = await appointModel.findByIdAndUpdate(appointmentId)
        if(appointmentData && appointmentData.docId === docId){
           await appointModel.findByIdAndUpdate(appointmentId,{cancelled:true})
           return res.json({
            success:true,
            message:"Appointment cancelled successfully"
 
           })
        }
        else{
            return res.json({
                success:false,
                message:"cancellation failed"
            })
        }
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
} 

// APi to get dashboard data for doctor panel

const doctorDashboard = async(req,res)=>{
    try{
        const {docId}=req.body;
        const appointments= await appointModel.find({docId})

        let earnings =0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }

        })

        let patients = [];
        appointments.map((item)=>{
           if(!patients.includes(item.userId)){
            patients.push(item.userId)
           }
        })

        const dashData={
            appointments:appointments.length,
            earnings,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        return res.json({
            success:true,
            dashData
        })
            
        
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }

}

// API for doctor profile for doctor panel
const doctorProfile = async(req,res)=>{
    try{
        const {docId}=req.body;
        const profileData = await doctorMOdel.findById(docId).select('-password')

        return res.json({
            success:true,
            profileData
        })
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

// APi to update doctor profile data fro, Doctor Panel
const updateDoctorProfile=async(req,res)=>{
    try{
        const {docId,fees,address,available} = req.body;
        await doctorMOdel.findByIdAndUpdate(docId,{fees,address,available})
        return res.json({
            success:true,
            message:"Profile updated successfully"
        })
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}


export {changeAvailablity,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorList,doctorDashboard,doctorProfile,updateDoctorProfile}
import { createContext, useState } from "react";
import {toast} from 'react-toastify'
import axios from 'axios'


export const DoctorContext = createContext();
const DoctorContextProvider =(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const[dToken,setDToken]=useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') :'');

    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState(false);
    const [profileData,setProfileData]=useState(false);

    
    const getAppointments = async ()=>{
        try{
            const {data} = await axios.get(`${backendUrl}/api/doctor/appointments`,{headers:{dToken}})
           // console.log(data);
            if(data.success){
                setAppointments(data.appointments);
                console.log(data.appointments)
            }
            else{
                toast.error(data.message)
            }
    }catch(err){
        console.log(err.message)
        toast.error(err.message)
    }
}

 const completeAppointment = async(appointmentId)=>{

    try{
        const {data}= await axios.post(`${backendUrl}/api/doctor/complete-appointment`,{appointmentId},{headers:{dToken}})
        if(data.success){
            toast.success(data.message);
            getAppointments();
        }else{
            toast.error(data.message);
        }
    }catch(err){
        console.log(err.message)
        toast.error(err.message)
    }
 }

 const cancelAppointment = async(appointmentId)=>{

    try{
        const {data}= await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,{appointmentId},{headers:{dToken}})
        if(data.success){
            toast.success(data.message);
            getAppointments();
        }else{
            toast.error(data.message);
        }
    }catch(err){
        console.log(err.message)
        toast.error(err.message)
    }
 }

 const getDashData = async()=>{
    try{
        const {data}= await axios.get(`${backendUrl}/api/doctor/dashboard`,{headers:{dToken}})
        if(data.success){
            setDashData(data.dashData);
            console.log(data.dashData);
            
        }
        else{
            toast.error(data.message);
        }
    }catch(err){
        console.log(err.message)
        toast.error(err.message)

    }
 }

 const getProfileData = async function () {
     try {
         const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dToken } });
         if (data.success) {
             setProfileData(data.profileData);
             console.log(data.profileData);

         }
         else {
             toast.error(data.message);
         }
     } catch (err) {
         console.log(err.message);
         toast.error(err.message);
     }
}


     const value = {
         dToken, setDToken, backendUrl,
         appointments, getAppointments, setAppointments,
         completeAppointment, cancelAppointment,
         dashData, setDashData, getDashData,
         profileData, setProfileData, getProfileData
     };
     return (
         <DoctorContext.Provider value={value}>
             {props.children}
         </DoctorContext.Provider>
     );
 }

 
export default DoctorContextProvider
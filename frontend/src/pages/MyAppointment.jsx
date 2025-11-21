import { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/App'
import { toast } from 'react-toastify';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const MyAppointment = () => {
  const {backendUrl,token,getAllDoctorsData}=useContext(AppContext);
  const navigate=useNavigate()

  const [appointments,setAppointments]=useState([]);
  const months=[" ","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate)=>{
    const dateArray=slotDate.split('_');
    return dateArray[0]+" "+months[Number(dateArray[1])] + " "+dateArray[2];


  }

  const getUserAppointments = async () => {
    try{
      const {data}= await axios.get(`${backendUrl}/api/user/appointments`,{headers:{token}});
      if(data.success){
        setAppointments(data.appointments.reverse());
        console.log(data.appointments)


      }

    }catch(e){
      console.log(e);
      toast.error(e.message)
    }
  }
  
  const cancelAppointment = async(appointmentId)=>{
    try{
      const {data} = await axios.post(`${backendUrl}/api/user/cancel-appointment`,{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message);
        getUserAppointments();
        getAllDoctorsData();
      }
      else{
        toast.error(data.message);
      }
     

    }catch(e){
      console.log(e);
      toast.error(e.message)
    }
  }

  const initPay = (order)=>{
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    // console.log("Razorpay Key ID:", razorpayKeyId ? "Found" : "Missing");
    // console.log("All env vars:", import.meta.env);
    
    // Check if Razorpay script is loaded
    if(!window.Razorpay){
      toast.error("Razorpay payment script is not loaded. Please refresh the page.");
      console.error("window.Razorpay is not available");
      return;
    }
    
    // Check if Razorpay key is configured
    if(!razorpayKeyId || razorpayKeyId === 'undefined' || razorpayKeyId.trim() === ''){
      toast.error("Razorpay payment gateway is not configured. Please add VITE_RAZORPAY_KEY_ID to your .env file.");
      console.error("VITE_RAZORPAY_KEY_ID is missing or empty. Current value:", razorpayKeyId);
      return;
    }
    
    const options={
      key: razorpayKeyId, // Razorpay checkout.js uses 'key' property
      amount:order.amount,
      currency:order.currency,
      name:'Appointment payment',
      description:'Appointment payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        console.log("Payment response:", response)
        try{
          const {data}= await axios.post(`${backendUrl}/api/user/verifyRazorpay`,response,{headers:{token}})
          if(data.success){
            toast.success(data.message);
            getUserAppointments();
            navigate('/my-appointments')
            
        }}catch(err){
          console.log(err);
          toast.error(err.message)

        }
       },
       prefill: {
         name: "",
         email: "",
         contact: ""
       },
       theme: {
         color: "#3399cc"
       }
    }
    
    try {
      console.log("Initializing Razorpay with options:", { ...options, key: "***hidden***" });
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || response.error.reason}`);
      });
      rzp.open();
    } catch(err) {
      console.error("Razorpay initialization error:", err);
      toast.error("Failed to initialize payment gateway: " + (err.message || "Unknown error"));
    }

  }

  const appointmentRazorpay = async(appointmentId)=>{
    try{
      const {data}= await axios.post(`${backendUrl}/api/user/payment-razorpay`,{appointmentId},{headers:{token}})
      if(data.success){
        //console.log(data.order);
        initPay(data.order)

      }
    }catch(e){
      console.log(e);
      toast.error(e.message)
    }


  }

  useEffect(()=>{
    if(token) getUserAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])
  
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointment</p>
      <div>
        {
         appointments.slice(0,appointments[-1]).map((item,index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50 ' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p className='text-zinc-700 font-medium mt-1'>{item.docData.speciality}</p>
              <p>Address:</p>
              <p className='text-xs '>{item.docData.address.line1}</p>
              <p className='text-xs '>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium' >Date & time :</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {
                !item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50' >paid</button>
              }
              {!item.cancelled && !item.payment && !item.isCompleted &&  <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay online </button> }
              {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>cancel appiontment</button> }
              {item.cancelled && !item.isCompleted && <button className='sm:min-48 p-3 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
              {
                item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
              }
            </div>
          </div>
          
         )) 
        }

      </div>
    </div>
  )
}

export default MyAppointment

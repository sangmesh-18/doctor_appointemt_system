import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  
  const {backendUrl, token, setToken, userData, loadUserProfileData} =useContext(AppContext)
 
  const [state,setState] =useState('sign up')
  const [email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const [name,setName]=useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate= useNavigate();
  
  const submitHandler=async (e)=>{
    e.preventDefault();
  
  try{
    if(state === 'sign up'){
      const {data} = await axios.post(`${backendUrl}/api/user/register`,{name,password,email})
      if(data.success){
        console.log("Login/Register successful, token:", data.token);
        localStorage.setItem('token',data.token);
        setToken(data.token);
        // Load user profile data after setting token
        if(loadUserProfileData){
          console.log("Loading user profile data...");
          await loadUserProfileData(data.token);
        }
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
      else{
        toast.error(data.message);
      }
    }
    else{
      const {data} = await axios.post(`${backendUrl}/api/user/login`,{password,email})
      if(data.success){
        console.log("Login/Register successful, token:", data.token);
        localStorage.setItem('token',data.token);
        setToken(data.token);
        // Load user profile data after setting token
        if(loadUserProfileData){
          console.log("Loading user profile data...");
          await loadUserProfileData(data.token);
        }
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
      else{
        toast.error(data.message);
      }

    }
  }catch(err){
    toast.error(err.message);
  }
}
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
}; 

 useEffect(()=>{
  // Only redirect if user is already logged in and has valid token
  // Allow access to login page for account switching
  if(token && userData){
    navigate('/')
  }
 }, [token, navigate, userData])

  return (
    <form onSubmit={submitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3  m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'sign up'? "Create Account":"Login" }</p>
        <p>Please {state === 'sign up'? "sign up ":"log in "}to book Appointment</p>
        {
          state === 'sign up' && <div className='w-full '>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} name="" value={name} required />
          </div>

        }
        
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>setEmail(e.target.value)} name="" value={email} required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <div className='relative'>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type='button'
              className='absolute right-2 top-2 text-sm text-gray-600'
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
       
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base '>{state === 'sign up'? "Create Account":"Login" }</button>
        {
          state === 'sign up'?
          <p>Already have an account?<span onClick={()=>setState('log in')} className='text-primary underline cursor-pointer' >login here</span></p>
          : <p>create an new account?<span onClick={()=>setState('sign up')} className='text-primary underline cursor-pointer'>click here</span> </p>
        }
      </div>
      
    </form>
  )
}

export default Login

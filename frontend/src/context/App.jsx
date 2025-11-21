import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);   
    const [doctors, setDoctors] = useState([]);
    const [token,setToken]=useState(localStorage.getItem('token') ? localStorage.getItem('token') :false);
    const [userData,setUserData]=useState(false);



    const getAllDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            console.log(data);
            if (data.success) {
                setDoctors(data.doctors);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            if (err.response) {
                toast.error(err.response.data.message || "An error occurred");
            } else {
                toast.error(err.message);
            }
        }
    };
    
    useEffect(() => {
        getAllDoctorsData();  // Fetch the data when context is initialized
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      
    const loadUserProfileData= async(currentToken = token)=>{
        try{
            if(!currentToken || currentToken === 'false' || currentToken === false){
                console.log("No valid token, clearing userData");
                setUserData(false);
                return;
            }
            console.log("Loading user profile with token:", currentToken.substring(0, 20) + "...");
            const {data} =await axios.get(`${backendUrl}/api/user/get-profile`,{headers:{token: currentToken}})
            console.log("User profile response:", data);
            if(data.success && data.userData){
                console.log("Setting userData:", data.userData);
                setUserData(data.userData);
            }
            else{
                console.log("Failed to load user profile:", data.message);
                toast.error(data.message || "Failed to load user profile");
                setUserData(false);
            }
        }catch(err){
            console.error("Error loading user profile:", err);
            console.error("Error response:", err.response);
            if(err.response && err.response.status === 401){
                // Token is invalid, clear it
                console.log("Token is invalid, clearing");
                setToken(false);
                localStorage.removeItem('token');
                setUserData(false);
            } else {
                toast.error(err.response?.data?.message || err.message);
                setUserData(false);
            }
        }
    }
    const value = {
        doctors,getAllDoctorsData,
        currencySymbol,
        token,setToken,
        backendUrl,
        setUserData,userData,loadUserProfileData

    };

    
     // Run when token changes
     useEffect(()=>{
        if(token && token !== 'false' && token !== false){
            loadUserProfileData(token);
        }else{
            setUserData(false);
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[token, backendUrl])

    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

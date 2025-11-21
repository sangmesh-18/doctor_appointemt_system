import express from 'express';
import { addDoctor,allDoctors,loginAdmin,appointmentsAdmin,appointmentCancel,adminDashBoard,signUpAdmin } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import {changeAvailablity} from '../controllers/doctorController.js';


const adminRouter=express.Router();
adminRouter.post("/add-doctor",authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin);
adminRouter.post('/signup',signUpAdmin);
adminRouter.get('/all-doctors',authAdmin,allDoctors);
adminRouter.post('/change-availabilty',authAdmin,changeAvailablity);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);

adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel);

adminRouter.get('/dashboard',authAdmin,adminDashBoard);


export default adminRouter;
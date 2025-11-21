import { v2 as cloudinary } from "cloudinary";

let isCloudinaryConnected = false;

const connectCloudinary = async () => {
  if (isCloudinaryConnected) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,   // FIXED key name
  });

  isCloudinaryConnected = true;
  console.log("Cloudinary Connected");
};

export default connectCloudinary;

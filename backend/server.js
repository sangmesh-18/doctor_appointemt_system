import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

const PORT = process.env.PORT || 3000;

const app = express();

// ---- IMPORTANT: Lazy DB + Cloudinary Connection ----
let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    await connectDB();
    await connectCloudinary();
    isConnected = true;
  }
}

// Apply connection check before every request
app.use(async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (err) {
    console.error("Connection error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---- Middlewares ----
app.use(express.json());
app.use(cors(
    {
        origin:["http://localhost:5173","http://localhost:5174", "https://doctor-appointemt-system-1.onrender.com","https://doctor-appointemt-system-admin.onrender.com"],
        credentials: true,
    }
));

// ---- Routes ----
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// ---- Test Route ----
app.get("/", (req, res) => {
  res.send("API working on live mode!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


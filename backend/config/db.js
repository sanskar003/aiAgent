import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false; // connection state across hot reloads

const connectDB = async () => {
  if (isConnected) {
    // If already connected, reuse the connection
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw new Error("MongoDB connection failed");
  }
};

export default connectDB;
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      console.log("New MongoDB connection established");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("Error while waiting for MongoDB connection:", error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;

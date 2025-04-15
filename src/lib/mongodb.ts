import mongoose, { Mongoose } from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = { conn: null, promise: null };
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

  (global as any).mongoose = cached;

  return cached.conn;
}

export default connectDB;

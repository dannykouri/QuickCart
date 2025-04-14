import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  // VALIDATE URI
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not defined in environment variables");
  if (!uri.startsWith('mongodb')) {
    throw new Error(`Invalid MongoDB URI: ${uri}`);
  }

  const opts = {
    dbName: 'quickcart',
    bufferCommands: false,
  };

  try {
    cached.promise = mongoose.connect(uri, opts);
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
}

export default connectDB;
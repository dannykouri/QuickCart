import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env');
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      dbName: 'quickcart',
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Tăng timeout
      socketTimeoutMS: 45000, // Chờ kết nối lâu hơn
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => mongoose)
      .catch(err => {
        console.error('MongoDB Connection Error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
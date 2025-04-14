import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: 'quickcart',
        };

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}`, opts)
            .then(mongoose => mongoose)
            .catch(err => {
                console.error("MongoDB connection failed:", err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null; // Reset để thử lại lần sau
        throw err;
    }

    return cached.conn;
}

export default connectDB;
import { Inngest } from "inngest";
import mongoose from "mongoose"; // Đã sửa từ 'connect' thành 'mongoose'
import connectDB from "./db";
import User from "@/models/Users";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nhatminh-next" });

// Helper function để quản lý kết nối database
const withDBConnection = (handler) => async (params) => {
  try {
    await connectDB();
    return await handler(params);
  } finally {
    await mongoose.connection.close();
  }
};

// Inngest functions to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  withDBConnection(async ({ event }) => {
    console.log('Event data:', event.data); // Đã di chuyển vào trong hàm
    
    const user = await User.create({
      _id: event.data.id,
      name: `${event.data.first_name} ${event.data.last_name}`,
      email: event.data.email_addresses[0].email_address,
      imageUrl: event.data.image_url
    });
    
    return { success: true, userId: user._id };
  })
);

// Inngest function to update user data to a database
export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  withDBConnection(async ({ event }) => {
    console.log('Update event:', event.data);
    
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: `${first_name} ${last_name}`,
        email: email_addresses[0]?.email_address,
        imageUrl: image_url
      },
      { new: true }
    );

    if (!updatedUser) throw new Error(`User ${id} not found`);
    return { success: true, user: updatedUser };
  })
);

// Inngest function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  withDBConnection(async ({ event }) => {
    console.log('Delete event:', event.data);
    
    const { id } = event.data;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      console.warn(`User ${id} not found for deletion`);
      return { success: false, message: "User not found" };
    }
    
    return { success: true, userId: id };
  })
);
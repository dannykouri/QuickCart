import { Inngest } from "inngest";
import { connect } from "mongoose";
import connectDB from "./db";
import User from "@/models/Users";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nhatminh-next" });


// Inngest functions to save  user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
      try {
        await connectDB();
        const user = await User.create({
          _id: event.data.id,
          name: `${event.data.first_name} ${event.data.last_name}`,
          email: event.data.email_addresses[0].email_address,
          imageUrl: event.data.image_url
        });
        return { success: true, userId: user._id };
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      } finally {
        await mongoose.connection.close();
      }
    }
  );

//Inngest fủnction to update user data to a database
export const syncUserUpdate = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
      try {
        await connectDB(); // Kết nối database
        
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        
        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            name: `${first_name} ${last_name}`,
            email: email_addresses[0]?.email_address,
            imageUrl: image_url
          },
          { new: true } // Trả về document sau khi update
        );
  
        if (!updatedUser) {
          throw new Error(`User ${id} not found`);
        }
  
        return { success: true, user: updatedUser };
      } catch (error) {
        console.error('❌ Update user error:', error);
        throw error;
      } finally {
        await mongoose.connection.close(); // Đóng kết nối
      }
    }
  );      
// Inngest function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
      try {
        await connectDB(); // Kết nối database
        
        const { id } = event.data;
        const deletedUser = await User.findByIdAndDelete(id);
  
        if (!deletedUser) {
          console.warn(`⚠️ User ${id} not found for deletion`);
          return { success: false, message: "User not found" };
        }
  
        return { success: true, userId: id };
      } catch (error) {
        console.error('❌ Delete user error:', error);
        throw error;
      } finally {
        await mongoose.connection.close(); // Đóng kết nối
      }
    }
  );

  console.log('Event data:', event.data);
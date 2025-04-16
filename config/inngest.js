import { Inngest } from "inngest";
import { connect } from "mongoose";
import connectDB from "./db";
import User from "@/models/Users";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nhatminh-next" });

export const syncUserCreation = inngest.createFunction(
  { id : "syncUsercreation"},
  { 
    event: "clerk/user.created"
  },
  async ({ event }) => {
    const { id, first_name,last_name,email_addresses,image_url } = event.data;
    const user = {
      _id:id,
      name: first_name+" "+last_name,
      email_addresses: email_addresses[0].email_address,
      image_url:image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id : "syncUserUpdation"},
  {
    event: "clerk/user.updated"
  },
  async ({ event }) => {
    const { id, first_name,last_name,email_addresses,image_url } = event.data;
    const user = {
      _id:id,
      name: first_name+" "+last_name,
      email_addresses: email_addresses[0].email_address,
      image_url:image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
)

export const syncUserDeletion = inngest.createFunction(
  { id : "syncUserDeletion"},
  { 
    event: "clerk/user.deleted"
  },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
)
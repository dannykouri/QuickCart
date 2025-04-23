import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nhatminh-next" });

export const syncUserCreation = inngest.createFunction(
  { id: "syncUserCreation" },
  {
    event: "clerk/user.created",
  },
  async ({ event,step }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const user = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address, // đúng với schema
      imageUrl: image_url,                      // đúng với schema
    };

    await connectDB();
    await User.create(user); // ✅ sửa userData → user
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "syncUserUpdation" },
  {
    event: "clerk/user.updated",
  },
  async ({ event,step }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const user = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, user); // ✅ sửa userData → user
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "syncUserDeletion" },
  {
    event: "clerk/user.deleted",
  },
  async ({ event,step }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete({clerk:id});
  }
);


// ingest functions to create order and update product stock
export const createUserOrder = inngest.createFunction(
  { 
    id: "createUserOrder", 
    batchEvents:{
      maxSize:5,
      timeout:'5s'
    }
  },
  {
    event: "order/created",
  },
  async ({ event}) => {    
    // Create order logic here
    const order = event.map((event) => {
      return {
        userId:event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      }
    });

    await connectDB();
    await order.insertMany(order);
    return ({ success: true,processed:order.length });
  }
);
import { Inngest } from "inngest";
import { connect } from "mongoose";
import connectDB from "./db";
import User from "@/models/Users";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nhatminh-next" });

// Inngest functions to save  user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    {
        trigger:{
            event: "clerk/user.deleted",
        },     
    },
    async ({ event, step }) => {
        const { id,first_name,last_name,email_addresses,image_url } = event.data;
        const userData = {
            _id: id,
            name: first_name +' '+ last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url,    
        };    
        await connectDB();
        await User.create(userData)
    }        
);

//Inngest fủnction to update user data to a database
export const syncUserUpdate = inngest.createFunction(
    {
        id: "update-user-from-clerk", 
    },
    {
        trigger:{
            event: "clerk/user.deleted",
        },   
    },
    async ({ event, step }) => {
        const { id,first_name,last_name,email_addresses,image_url } = event.data;
        const userData = {
            _id: id,
            name: first_name +' '+ last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url,    
        };    
        await connectDB();
        await User.findByIdAndUpdate(id, userData)
    }        
);
// Inngest function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-from-clerk",
    },
    {
        trigger:{
            event: "clerk/user.deleted",
        },  
    },
    async ({ event , step}) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id)
    }        
);  
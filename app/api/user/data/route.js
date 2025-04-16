import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();
    const { userId } = getAuth(request);
    const user = await User.findOne({ clerkId: userId });
    console.log(user)
    if (!user) {
      return NextResponse.json({ success: false,message: "User not found" });
    }
    return NextResponse.json({ success: true, user })
  } catch (error) { 
    return NextResponse.json({ success: false, message: error.message });
  } 
}
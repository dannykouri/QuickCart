import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();
    const { userId } = getAuth(request);  
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ success: false,message: "User not found" });
    }
    return NextResponse.json({ success: true, user })
  } catch (error) { 
    console.error("Error during user sync operation:");
    console.error("Stack Trace:", error.stack);
    console.error("Message:", error.message);
    
    return NextResponse.json({
      success: false,
      message: `Error: ${error.message}`,// Bao gồm event data để biết thêm ngữ cảnh
      stack: error.stack,
      timestamp: new Date().toISOString(),  // Thêm thời gian lỗi
    });
  } 
}
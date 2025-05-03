import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import HeaderSlider from "@/models/Headerslider";

export async function GET() {
  try {
    await connectDB();
    
    const data = await HeaderSlider.find({}).sort({ date: -1 }).lean();

    // Format lại dữ liệu để đảm bảo image luôn là mảng
    const headerslider = data.map(item => ({
      ...item,
      _id: item._id.toString(),
      image: item.image ? [item.image] : [] // Chuyển string thành array
    }));

    return NextResponse.json({
      success: true,
      sliders: headerslider // Đổi tên thành sliders để khớp frontend
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
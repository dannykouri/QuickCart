import connectDB from "@/config/db";
import HeaderSlider from "@/models/Headerslider";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // Kiểm tra quyền của người dùng
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const formData = await request.formData();

    const title = formData.get('title');
    const offer = formData.get('offer');
    const file = formData.get('image');  // Lấy 1 ảnh (thay vì getAll)

    // Kiểm tra nếu không có ảnh
    if (!file) {
      return NextResponse.json({ success: false, message: "Chưa có ảnh" });
    }

    // Upload ảnh lên Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });

    // Lấy URL của ảnh đã upload
    const imageUrl = result.secure_url;

    // Kết nối database và lưu thông tin
    await connectDB();
    const newHeaderSlider = await HeaderSlider.create({
      userId,
      title,
      offer,
      image: imageUrl,  // Lưu URL dạng string (nếu model cho phép)
      // Hoặc nếu muốn giữ dạng mảng: image: [imageUrl]
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Sự Kiện Mới đã được thêm vào",
      newHeaderSlider,
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
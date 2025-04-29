import connectDB from "@/config/db";
import Product from "@/models/Product";
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
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const formData = await request.formData();

    const productId = formData.get("productId"); // 👈 Lấy ID sản phẩm để cập nhật
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");
    const files = formData.getAll("images");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Thiếu ID sản phẩm" });
    }

    await connectDB();

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    // 👇 Nếu có ảnh mới thì upload và thay ảnh cũ
    let imageUrls = existingProduct.image;
    if (files.length > 0 && files[0] instanceof File) {
      const results = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "auto" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.secure_url);
                }
              }
            );
            stream.end(buffer);
          });
        })
      );
      imageUrls = results;
    }

    // 👇 Cập nhật sản phẩm
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = Number(price);
    existingProduct.offerPrice = Number(offerPrice);
    existingProduct.category = category;
    existingProduct.image = imageUrls;
    existingProduct.date = Date.now();

    await existingProduct.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: existingProduct,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

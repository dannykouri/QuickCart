import connectDB from "@/config/db";
import Product from '@/models/Product';
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const { id}  = params;
    
    try {
        await connectDB();

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Sản phẩm không kiếm thấy" },
                { status: 404 }
            );
        }

        // Xóa sản phẩm
        await Product.findByIdAndDelete(id);

        return NextResponse.json(
            { success: true, message: "Sản phẩm đã được xóa thành công" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
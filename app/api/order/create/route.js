
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { inngest } from "@/config/inngest";
import User from "@/models/Users";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { items, address } = await request.json();
    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: 'invalid data' });
        
    }
    
    const amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return await acc + product.offerPrice * item.quantity;
    },0);
    

    await inngest.send({
      name:'clerk/order.created',
      data: {
        userId,
        items,
        address,
        amount:amount + Math.floor(amount * 0.02),
        date: Date.now()
      },
    });

    //clear user cart
    const user =await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  user: {
    type: String,   
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: String,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {    
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Order Placed",
  },
  date: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
import { Order } from "../models/orderModel.js"
import crypto from "crypto";
import Razorpay from 'razorpay'
import 'dotenv/config'


const razorpay = new Razorpay(
  {
    key_id: process.env.RP_TEST_KEY,
    key_secret: process.env.RP_TEST_SECRET
  }
)


const createOrder = async (req, res) => {
  try {
    const { amount, products } = req.body;
    const userId = req.user?._id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const newOrder = await Order.create({
      user_id: userId,
      products, 
      amount,
      razorpay_order_id: razorpayOrder.id,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      newOrder,
      razorpayOrder, // Frontend looks for this!
    });

  } catch (error) {
    console.error("SERVER ERROR:", error); // LOOK AT YOUR TERMINAL FOR THIS
    res.status(500).json({
      success: false,
      message: error.message || "Order creation failed",
    });
  }
};




const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log(req.body)

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RP_TEST_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment is authentic, update the DB
    await Order.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        isPaid: true,
        status: "Completed",
      }
    );

    res.status(200).json({
      success: true,
      message: "order Placed" 

     });
  } else {
    res.status(400).json({ success: false, message: "Invalid Signature" });
  }
};



export { createOrder, verifyPayment }
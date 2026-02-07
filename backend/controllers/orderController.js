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
    const { amount, products, shippingAddress } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Validate shipping address (basic check)
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipcode) {
      return res.status(400).json({ success: false, message: "Shipping address is incomplete" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const newOrder = await Order.create({
      user_id: userId,
      products, // Expecting detailed products array from frontend
      amount,
      shippingAddress,
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



const fetchOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    const orders = await Order.find({ user_id: userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// Fetch a specific order by ID (for the authenticated user)
const fetchOrderDetails = async (req, res) => {
  try {
    const userId = req.id; // isAuthenticated middleware sets req.id
    const orderId = req.params.orderId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const order = await Order.findOne({ user_id: userId, _id: orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
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




const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const order = await Order.findOne({ _id: id, user_id: userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Cannot cancel order that is not pending" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createOrder, verifyPayment, fetchOrders, fetchOrderDetails, getAllOrders, updateOrderStatus, cancelOrder }
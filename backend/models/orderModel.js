import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "" }, // Optional if not captured
      zipcode: { type: String, required: true },
      country: { type: String, default: "India" },
      phoneNumber: { type: String, required: true },
    },

    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true }, // Snapshot of name
        image: { type: String, required: true }, // Snapshot of image
        price: { type: Number, required: true }, // Snapshot of price at purchase
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    razorpay_order_id: {
      type: String,
      required: true,
    },

    razorpay_payment_id: {
      type: String,
      default: null,
    },

    razorpay_signature: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "NetBanking", "Wallet"],
      default: "Card"
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Completed", "Cancelled"],
      default: "Pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // creates createdAt & updatedAt automatically
);

export const Order = mongoose.model("Order", orderSchema);

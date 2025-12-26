import Cart from '../models/cartModel.js'
import { Product } from "../models/ProductModel.js"
import mongoose from 'mongoose'


export const addToCart = async (req, res) => {
  console.log("🛒 Add to Cart - Working");

  try {
    const { productId, quantity } = req.body;
    const userId = req.id;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId or productId missing",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [], totalPrice: 0 });

    // Convert and validate quantity
    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    // Check if product already exists in cart
    const idx = cart.items.findIndex(i => i.product.toString() === productId);

    if (idx >= 0) {
      cart.items[idx].quantity = qtyToAdd;
    } else {
      cart.items.push({ product: productId, quantity: qtyToAdd });
    }

    // Fetch all products in cart for price calculation
    const ids = cart.items.map(i => i.product);
    const products = await Product.find({ _id: { $in: ids } }).select('productPrice');

    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => {
      const prod = products.find(p => p._id.toString() === item.product.toString());
      const price = prod?.productPrice || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);

    cart.totalPrice = Number(totalPrice.toFixed(2));

    await cart.save();
    await cart.populate('items.product', 'productName productPrice productOriginalPrice productImg productStock');

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });

  } catch (error) {
    console.error("🔥 Add to Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
    });
  }
};




export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing"
      });
    }
    console.log("Fetching cart for user:", userId);

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    // console.log("Cart found:", cart);
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// DELETE /api/v1/cart/remove-item
export const removeItem = async (req, res) => {
  // const {productId } = req.body
  // console.log("item removed")
  // console.log(productId)

  try {
    const { productId } = req.body;
    const userId = req.id

    if (!productId || !userId) {
      return res.status(404).json({
        success: false,
        message: "userId or produdctId not found"
      })
    }
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemExists = cart.items.some(
      item => item.product._id.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.productPrice * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({
      success: true,
      cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const clearCart = async (req, res) => {
  console.log("🛒 Clearing Cart - Working");

  try {
    const userId = req.id; // Consistent with your addToCart logic

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
 
    // Reset the cart fields
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("🔥 Clear Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    });
  }
};
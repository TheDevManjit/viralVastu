import Cart from '../models/cartModel.js'
import { Product } from "../models/ProductModel.js"
import mongoose from 'mongoose'


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.id;

    console.log(quantity, typeof quantity);

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId or productId missing"
      });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(productId).select('price productPrice');

    if (!product) return res.status(404).json({
      success: false,
      message: "Product not found"
    });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) cart = new Cart({ user: userId, items: [], totalPrice: 0 });

    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx >= 0) {
      cart.items[idx].quantity = qty;
    } else {
      cart.items.push({ product: productId, quantity: qtyToAdd });
    }

    // ---- correct total calculation ----
    const ids = cart.items.map(i => i.product);
    const prods = await Product.find({ _id: { $in: ids } }).select('price productPrice');
    const priceMap = new Map(prods.map(p => [p._id.toString(), (p.price ?? p.productPrice ?? 0)]));



    const total = cart.items.reduce((sum, item) => {
      const unit = priceMap.get(item.product.toString()) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + unit * qty;
    }, 0);

    cart.totalPrice = Number(total.toFixed(2));
    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product', 'name price productPrice');

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: updatedCart,
    });

  } catch (error) {
    console.error("🔥 Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
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
    console.log("Cart found:", cart);
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
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
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

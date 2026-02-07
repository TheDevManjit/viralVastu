import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItem } from "../redux/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    // We might want to fetch only if not already loaded or on mount always
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeItem({ productId }));
  };

  const cartItems = cart?.items || [];
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.productPrice * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // Empty State
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg shadow-blue-200 shadow-lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar / Header Placeholder */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link to="/products" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Shopping Cart ({cartItems.length})</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product._id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <CardContent className="p-0 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-48 sm:h-32 bg-gray-100 sm:rounded-lg overflow-hidden flex-shrink-0 relative group">
                    {item.product.productImg?.[0]?.url ? (
                      <img
                        src={item.product.productImg[0].url}
                        alt={item.product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between p-4 sm:p-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                          {item.product.productName}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.product.category?.name || "Category"}
                        </p>
                      </div>
                      <p className="font-bold text-lg text-gray-900 whitespace-nowrap">
                        ₹{item.product.productPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        {/* Static quantity for now as removing item is the main action provided */}
                        <div className="px-3 py-1 text-sm font-medium text-gray-700">
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 px-2"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="bg-gray-900 text-white p-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Order Summary
                  </h2>
                </div>
                <CardContent className="p-6 space-y-6 bg-white">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Estimate</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>₹0</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4">
                    <div className="flex justify-between items-end">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-2xl text-blue-600">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-200 transform hover:-translate-y-0.5 transition-all duration-200"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShoppingBag className="w-3 h-3" />
                    <span>Secure Checkout</span>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link to="/products" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                  Or Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;

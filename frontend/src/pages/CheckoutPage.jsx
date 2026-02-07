import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, clearCart } from "../redux/cartSlice";
import { createOrder, verifyPayment } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/Loader";
import axios from "axios";

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, loading: cartLoading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const cartItems = cart?.items || [];
    const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.product.productPrice * item.quantity,
        0
    );

    const handlePayment = async () => {
        if (!user) {
            alert("Please login to proceed");
            navigate("/login");
            return;
        }

        setIsProcessing(true);

        try {
            // Validation
            if (!user.address || !user.city || !user.zipcode) {
                alert("Please update your profile with a complete address (Address, City, Zipcode) before checking out.");
                navigate("/profile");
                return;
            }

            // 1. Create Order on Backend
            const shippingAddr = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                address: user.address,
                city: user.city,
                zipcode: user.zipcode,
                phoneNumber: user.phoneNo || "9999999999",
                country: "India"
            };

            const orderData = {
                products: cartItems.map(item => ({
                    product_id: item.product._id,
                    name: item.product.productName || "Unknown Product",
                    image: item.product.productImg?.[0]?.url || "",
                    price: item.product.productPrice || 0,
                    quantity: item.quantity
                })),
                amount: totalAmount,
                shippingAddress: shippingAddr
            };

            console.log("Sending Order Data:", orderData); // Debug log

            const createOrderAction = await dispatch(createOrder(orderData));

            if (createOrder.rejected.match(createOrderAction)) {
                throw new Error(createOrderAction.payload || "Failed to create order");
            }

            const { newOrder, razorpayOrder } = createOrderAction.payload;

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RP_TEST_KEY, // Ensure this env var exists in frontend
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "ViralVastu",
                description: "Order Payment",
                image: "/logo.png", // specific logo path
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await dispatch(verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }));

                        if (verifyPayment.fulfilled.match(verifyRes)) {
                            alert("Payment Successful!");
                            dispatch(clearCart());
                            navigate("/orders");
                        } else {
                            alert("Payment Verification Failed!");
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    contact: user.phoneNumber || "", // Handle if phone is missing
                },
                notes: {
                    address: `${user.address}, ${user.city}`,
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };


            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please check your internet connection.");
                setIsProcessing(false);
                return;
            }

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.description);
                setIsProcessing(false);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.message || "Something went wrong during checkout");
            setIsProcessing(false);
        }
    };

    if (cartLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

    if (cartItems.length === 0) {
        return <div className="h-screen flex items-center justify-center">Your cart is empty</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Summary */}
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold mb-4">Shipping Address</h2>
                            <p>{user?.firstName} {user?.lastName}</p>
                            <p>{user?.address}</p>
                            <p>{user?.city} - {user?.zipcode}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold mb-4">Order Items</h2>
                            {cartItems.map((item) => (
                                <div key={item.product._id} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                            {item.product.productImg?.[0]?.url &&
                                                <img src={item.product.productImg[0].url} alt="" className="w-full h-full object-cover" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.product.productName}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">₹{item.product.productPrice * item.quantity}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Section */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-4 bg-gray-50">
                            <h2 className="font-semibold mb-4 text-lg">Order Summary</h2>
                            <div className="flex justify-between py-2 border-b">
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between py-3 font-bold text-lg">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>

                            <Button
                                className="w-full mt-4"
                                size="lg"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Pay Now"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

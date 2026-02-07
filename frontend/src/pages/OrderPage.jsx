import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, cancelOrder } from "../redux/orderSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";

const OrderPage = () => {
    const dispatch = useDispatch();
    // Ensure we select from 'orders' slice, not 'carts'
    const { orders, loading, error } = useSelector((state) => state.orders);

    // Also get user info if needed for display, though orders usually contain shipping info if stored
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            await dispatch(cancelOrder(orderId));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {typeof error === 'string' ? error : "An error occurred fetching orders"}
            </div>
        );
    }

    // Ensure orders is an array before mapping
    const orderList = Array.isArray(orders) ? orders : [];

    if (orderList.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
                <div className="text-gray-600">No orders found</div>
                <Link to="/products" className="text-blue-600 hover:underline">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full flex justify-between items-center bg-gray-100 z-10 px-4 py-3 shadow-sm">
                <Link to="/" className="p-2 rounded-full hover:bg-gray-200">
                    <ArrowLeft size={24} />
                </Link>
                <span className="font-semibold text-lg">My Orders</span>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            <div className="max-w-4xl mx-auto mt-20 p-4 space-y-6 pb-10">
                {orderList.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded-lg bg-white shadow-sm overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Placed</p>
                                        <p className="text-sm font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                        <p className="text-sm font-medium">₹{order.amount}</p>
                                    </div>
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Ship To</p>
                                        <p className="text-sm font-medium truncate max-w-[150px]" title={order.shippingAddress?.address}>
                                            {order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : user?.firstName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${order.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {order.status}
                                </span>
                                {order.status === "Pending" && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => handleCancelOrder(order._id)}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Products */}
                        <div className="p-4 space-y-4">
                            {order.products.map((item, index) => (
                                <div key={`${order._id}-${item.product?._id || index}`} className="flex gap-4">
                                    <div className="w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden bg-gray-100 relative">
                                        {item.product?.productImg?.[0]?.url ? (
                                            <img
                                                src={item.product.productImg[0].url}
                                                alt={item.product.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 line-clamp-2">{item.product?.productName || "Unknown Product"}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                        <p className="text-sm font-medium mt-1">₹{item.product?.productPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default OrderPage;

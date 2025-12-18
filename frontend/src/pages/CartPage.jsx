import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {  UserRound,  } from "lucide-react";
import { toast } from 'sonner';
import axios from 'axios';
import store from '@/redux/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../redux/cartSlice.js';
import { removeItem } from '../redux/cartSlice.js';
import Loader from '@/components/Loader.jsx';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';



const CartPage = () => {
  const { cart, loading, error } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.user)
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart()) // this triggers the thunk
  }, [dispatch])


  function handleRemove(id) {
    dispatch(removeItem({ productId: id }))
      .unwrap()
      .then(() => toast.success("Item removed from cart"))
      .catch(() => toast.error("Failed to remove item"));
  }


  console.log(user)


  if (loading) return <div className='flex justify-center items-center h-screen text-gray-600"'><Loader /></div>
  if (error) return <div>Error: {error.message}</div>


  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Cart is empty
      </div>
    );
  }

  return (
    <>
      <div>
        <nav className="w-full hidden md:flex text-white bg-linear-to-r from-blue-500 to-blue-600 fixed top-0 left-0 z-50 shadow-sm">
          <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-center items-center h-16 gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-50 w-auto object-contain overflow-hidden mt-2"
                />
              </Link>

              {/* Right side */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/products"
                  className="hover:text-green-600 border border-transparent transition font-medium hover:border hover:border-[#676D6C] rounded p-1"
                >
                  Products
                </Link>

                 {user ? (
                <div className="relative group flex items-center gap-2">
                  <UserRound size={18} />
                  <span>{user.firstName}</span>
                  <div className="hidden group-hover:flex absolute w-30 h-24 bg-white top-6 rounded text-black transition delay-150 duration-300 ease-in-out">
                    <ul className="p-2">
                      <li className="hover:bg-gray-200 rounded p-2">
                        <Link to={`profile/${user._id}`}>Profile</Link>
                      </li>
                      <li className="hover:bg-gray-200 rounded p-2">
                        <Link to={`/orders`}>Orders</Link>
                      </li>

                    </ul>

                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-100 border border-transparent transition font-medium rounded p-1"
                >
                  <UserRound size={18} />
                  <span>Profile</span>
                </Link>
              )}


              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="  flex flex-col md:flex-row justify-center gap-6 p-6 bg-gray-50 min-h-screen lg:mt-20 mt-2 mb-50">
        <div className=' max-w-7xl flex flex-col md:flex-col justify-center gap-5'>
          <div className="fixed top-0 left-0 w-full lg:top-15 lg:w-[50%] lg:left-[25%] flex justify-between items-center bg-gray-200 text-red-400 z-10 px-3 py-2">
            <Link to="/">
              <ArrowLeft />
            </Link>

            <Link to={`profile/${user._id}`}>
              <span>Change Address</span>
            </Link>
          </div>



          <div className="flex-1 space-y-4 ">
            <div className='border p-2 bg-white'>
              <div className='flex justify-between mb-2'>
                <h3>Your item delivered to :</h3>

              </div>


              <div>
                <p className='font-bold capitalize'>{user && `${user.firstName} ${user.lastName}`}</p>
                <div className='flex flex-row gap-4 capitalize'>
                  <span>{user && user.address}</span>
                  <span>{user && user.city}</span>
                  <span>{user && user.zipcode}</span>
                </div>

              </div>

            </div>



            {cart.items.map((item) => (


              <Card key={item._id} className="flex flex-row md:flex-row p-4 items-start">
                {

                  (item.product.productImg[0].url &&
                    <img
                      src={item.product.productImg[0].url}
                      alt={item.product.productName}
                      className="w-24 h-24 object-cover rounded-md border" />
                  )

                }

                <CardContent className="flex flex-col md:flex-row justify-between w-full gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product.productName}</h3>
                    {/* <p className="text-sm text-gray-500">Seller: {}</p> */}
                    {!item.product.productStock && (
                      <p className="text-red-500 font-medium">Out Of Stock</p>
                    )}

                    {item.product.productStock && (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="line-through text-gray-400 text-sm hidden md:flex">
                          ₹{item.product.productOriginalPrice}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{item.product.productPrice}
                        </p>
                        <p className="text-green-600 text-sm font-medium">
                          {Math.round(((item.product.productOriginalPrice - item.product.productPrice) / item.product.productOriginalPrice) * 100)}% off
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border rounded-md px-2 cursor-pointer">
                        {/* <button
                        onClick={() => decreaseQuantity(item.product._id)}
                        className="text-xl px-2"
                      >
                        -
                      </button>
                      <span className="px-2 font-medium">{quantities[item.product._id] || item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product._id)}
                        className="text-xl px-2"
                      >
                        +
                      </button> */}
                      </div>


                      <button
                        onClick={() => handleRemove(item.product._id)

                        }
                        className="text-sm font-medium text-red-600 hover:underline cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 ">
                      Delivery by <span className="font-medium text-gray-800">Sun Dec 7</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="w-full  bg-white p-4 rounded-lg shadow-md h-fit lg:w-[50%] lg:right-[25%] fixed bottom-0 right-0 ">
            <h3 className="font-semibold mb-3">Price Details</h3>
            <div className="flex justify-around py-2 border-b">
              <p>Total Items</p>
              <p>{cart.items.length}</p>
            </div>
            <div className="flex justify-around py-2 border-b">
              <p>Total Amount </p>
              <p className="font-semibold">₹{cart.totalPrice}</p>
            </div>
            <p className="text-green-600 text-sm mt-2">
              You will save ₹6,005 on this order
            </p>
            <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
              PLACE ORDER
            </Button>
          </div>

        </div>

      </div>
    </>

  );
};

export default CartPage;
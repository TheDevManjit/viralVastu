import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import store from '@/redux/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addToCart } from "../redux/cartSlice.js";
import { fetchCart } from '../redux/cartSlice.js';
import { removeItem } from '../redux/cartSlice.js';
import Loader from '@/components/Loader.jsx';


const CartPage = () => {
  const { cart, loading, error } = useSelector((state) => state.cart)
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





  if (loading) return <div className='flex justify-center items-center h-screen text-gray-600"'><Loader/></div>
  if (error) return <div>Error: {error.message}</div>


  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Cart is empty
      </div>
    );
  }

  return (

    <div className="  flex flex-col md:flex-row justify-center gap-6 p-6 bg-gray-50 min-h-screen mt-20">
      <div className=' max-w-7xl flex justify-center gap-5'>
        <div className="flex-1 space-y-4 ">
          {cart.items.map((item) => (


            <Card key={item._id} className="flex flex-col md:flex-row p-4 items-start">
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
                      <p className="line-through text-gray-400 text-sm">
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
                  <p className="text-sm text-gray-500">
                    Delivery by <span className="font-medium text-gray-800">Sun Dec 7</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-full md:w-80 bg-white p-4 rounded-lg shadow-md h-fit">
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
          <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">
            PLACE ORDER
          </Button>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
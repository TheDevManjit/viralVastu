import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addToCart } from "../redux/cartSlice.js";
import ProductCarousel from "../components/ProductCarousel.jsx";
import { Skeleton } from "../components/ui/skeleton.jsx";



export default function ProductPage() {
  const { id } = useParams(); // grab product ID from URL
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(store => store.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/product/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Product not found!
      </div>
    );
  }


  const handleAddToCart = async () => {
    // Logic to add product to cart
    if (!user) {
      toast.error("Please login to add items to cart.");
      navigate('/login');
      return;
    }

    if (!product._id) {
      toast.error("Invalid product. Cannot add to cart.");
      return;
    }
    console.log(product._id, "  ", quantity)

    dispatch(addToCart({ productId: product._id, quantity }))
    navigate("/cart")

  }




  return (
    <section className="max-w-7xl mx-auto px-6 lg:py-12 py-20 grid md:grid-cols-2 gap-8 mt-20">
      <div>
        <div className="gap-2 hidden md:flex ">
          {/* Thumbnail Swiper */}
          <Swiper
            direction="vertical"
            slidesPerView={4}
            spaceBetween={10}
            onSwiper={setThumbsSwiper}
            watchSlidesProgress
            modules={[Thumbs]}
            className="w-[90px] h-[450px] rounded-lg overflow-hidden"
          >
            {product.productImg?.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img.url}
                  alt={`thumb-${i}`}
                  className="cursor-pointer rounded-lg border hover:border-blue-500 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Main Image Swiper */}
          <Swiper
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Thumbs]}
            className="lg:w-full h-[450px] rounded-xl overflow-hidden shadow-md"
          >
            {product.productImg?.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img.url}
                  alt={`main-${i}`}
                  className="w-full h-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>



        </div>

        <div className="hidden md:flex">
          <p className="p-4 text-xl ">{product.productDescription}</p>
        </div>
        <div>
          {/* Mobile Main Image */}
          <div className="md:hidden w-full h-[350px] rounded-xl overflow-hidden shadow-md mb-6">
            {

              loading ? <Skeleton /> :
                <ProductCarousel
                  productImg={[...product.productImg]}
                  alt={product.productName}

                />
            }
          </div>
          
        </div>
      </div>



      {/* === RIGHT: Product Info === */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {product.productName}
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xl">★ ★ ★ ★ ☆</span>
          <span className="text-gray-500 text-sm">{product.productRating} • {product.productReviews} reviews</span>
        </div>

        <div className="text-sm space-y-1">
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {product.productCategory}
          </p>
          <p>
            <span className="font-semibold">Delivery:</span> With in 7 days delivery
          </p>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="font-medium mb-2">Quantity:</h3>
          <div className="flex items-center border rounded-lg w-fit">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-3 py-2 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-3 py-2 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Price & Buttons */}
        <div className="pt-4">
          <p className="text-xl font-semibold mb-4 ">
            Price:{" "}
            <span className="text-blue-600">
              ₹{product.productPrice}
            </span>
            {product.productOriginalPrice && (
              <span className="text-gray-400 line-through mx-3">
                ₹{product.productOriginalPrice}
              </span>
            )}

            {product.productOriginalPrice && (
              <span className="text-[20px] text-green-600 font-semibold mx-3">
                {Math.round(((product.productOriginalPrice - product.productPrice) / product.productOriginalPrice) * 100)}% off
              </span>)}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className="bg-blue-100 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-200 transition">
              Buy Now
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}

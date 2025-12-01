import { ShoppingCart, Heart, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCarousel from "./ProductCarousel";
import { Skeleton } from "./ui/skeleton";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ProductCard({
  productName,
  productPrice,
  productOriginalPrice,
  ProductDescription,
  productImg,
  _id,
  productReviews,
  productRating,
  isTrending,
  loading




}) {



  //  console.log(productImg)
  //  console.log(loading)


  return (
    <Link to={`/product/${_id}`}>

      <div className="  group relative bg-gray-50 hover:bg-white rounded-xl overflow-hidden  cursor-pointer hover:shadow-xl scale-[1.01] transition-all duration-300">

        {/* Badge + Trending */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">



          {isTrending && (
            <Badge className="!bg-orange-500 !text-white !px-2 !py-[2px] !rounded-md text-[12px]">
              <TrendingUp size={14} />
              Trending
            </Badge>
          )}
        </div>

        {/* Wishlist Icon */}
        <button className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden flex items-center justify-center">

          {

            loading ? <Skeleton /> :
              <ProductCarousel
                productImg={productImg}
                alt={productName}
               
              />
          }


          {/* <img
          src={image}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        /> */}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">

          {
            loading ? <>
              <Skeleton className="h-5 w-20 m-1" />
              <Skeleton className="h-5 w-[100px] m-1" />
              <Skeleton className="h-5 w-[120px] m-1" />

            </> : <>

              <h3 className="text-gray-900 group-hover:text-skybrand-400 transition-colors line-clamp-2">
                {productName}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mx-2" />
                <span className="text-gray-900">{productRating}</span>
                <span className="text-gray-500">({productReviews})</span>
              </div>

              {/* Price + Add to Cart */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className=" text-black font-semibold">₹{productPrice}</span>

                  {productOriginalPrice && (
                    <span className="text-gray-400 line-through">
                      ₹{productOriginalPrice}
                    </span>
                  )}

                  {productOriginalPrice && (
                    <span className="text-[12px] text-green-600 font-semibold">
                      {Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)}% off
                    </span>)}
                </div>
                <Button className="bg-skybrand-400 hover:bg-skybrand-500 text-white px-3 py-1 rounded-md flex items-center gap-1">
                  <ShoppingCart size={16} />
                  Add
                </Button>
              </div>
            </>
          }


        </div>
      </div>
    </Link>
  );
}

import { ShoppingCart, Heart, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCarousel from "./ProductCarousel";
import { Skeleton } from "./ui/skeleton";

export default function ProductCard({
  productName,
  productPrice,
  productOriginalPrice,
  productDescription,
  rating,
  reviews,
  productImg,
  badge,
  offers,
  trending,
  loading 
}) {

//  console.log(productImg)
//  console.log(loading)


  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">

      {/* Badge + Trending */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">

        {badge && (
          <Badge className="bg-purple-600 text-white hover:bg-purple-700">
            {badge}
          </Badge>
        )}

        {trending && (
          <Badge className="bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-1">
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
      <div className="relative aspect-square overflow-hidden bg-gray-100">

        {

          loading ? <Skeleton /> :
            <ProductCarousel
              productImg={productImg}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
          <Skeleton className="h-5 w-[80px] m-1" /> 
          <Skeleton  className="h-5 w-[100px] m-1"/> 
          <Skeleton  className="h-5 w-[120px] m-1" /> 
          
          </> : <>

            <h3 className="text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
              {productName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-900">{rating}</span>
              <span className="text-gray-500">({reviews})</span>
            </div>

            {/* Price + Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-semibold">${productPrice}</span>

                {productOriginalPrice && (
                  <span className="text-gray-400 line-through">
                    ${productOriginalPrice}
                  </span>
                )}
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1">
                <ShoppingCart size={16} />
                Add
              </Button>
            </div>
          </>
        }


      </div>
    </div>
  );
}

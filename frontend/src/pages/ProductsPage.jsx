import FilterSlider from "@/components/FilterSlider";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllProducts } from "../api/productApi.js";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice.js";
import { useLocation } from "react-router-dom";







export default function ProductsPage() {

  const { products } = useSelector(store => store.products);

  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || '';

  const [search, setSearch] = useState(searchQuery);

  console.log(searchQuery)

  useEffect(() => {
    async function fetchData() {
      const products = await getAllProducts();
      dispatch(setProducts(products));
      setLoading(false);
    }
    fetchData();
  }, []);


  console.log(products)
  console.log(priceRange[0])
  console.log(priceRange[1])


  const filteredProducts = products
    ?.filter(p => category === "All" || p.category === category)
    ?.filter(p => brand === "All" || p.brand === brand)
    ?.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])
    ?.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()))
    // ?.filter(p => p.brand.toLowerCase().includes(search.toLowerCase()));


  console.log(filteredProducts)


 return (
  <>
    <div className="pt-20 pb-10">

      {/* Main Container */}
      <div className="max-w-[1350px] mx-auto px-4 flex flex-col lg:flex-row gap-6">

        {/* Sidebar (full width on mobile, fixed width on large screens) */}
        <div className="w-full lg:w-[280px] shrink-0">
          <FilterSlider
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* Product Section */}
        <div className="flex-1 flex flex-col w-full">

          {/* Sort Section */}
          <div className="flex justify-end mb-4">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-5
          ">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} {...product} loading={loading} />
            ))}
          </div>

        </div>
      </div>

    </div>
  </>
);


}



import FilterSlider from "@/components/FilterSlider";
import React, { use, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "../api/productApi.js";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice.js";
import { useLocation } from "react-router-dom";
import axios from "axios";








export default function ProductsPage() {

  const { products } = useSelector(store => store.products);

  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [brand, setBrand] = useState("All");


  const dispatch = useDispatch();
  const location = useLocation();

  const [search, setSearch] = useState('');

 // console.log("searchQuery", searchQuery);




  useEffect(() => {

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search") || '';
    setSearch(searchQuery.toLowerCase());
    setBrand("All");
    setCategory(searchQuery)
  }, [location.search]);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/product/allProducts");
        if (res.data.success) {
          dispatch(setProducts(res.data.products));
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);




  // console.log(products)
  // console.log(priceRange[0])
  // console.log(priceRange[1])


  const filteredProducts = products
    ?.filter(
      (p) => brand === "All" || p.productBrand.toLowerCase() === brand.toLowerCase()
    )
    ?.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    )
    ?.filter(
      (p) =>
        search === "" ||
        p.productName.toLowerCase().includes(search) ||
        p.productCategory.toLowerCase().includes(search) ||
        p.productBrand.toLowerCase().includes(search) ||
        p.productDescription.toLowerCase().includes(search) ||
        p.productSubCategory.toLowerCase().includes(search)
    );


    

// useEffect(() => {
//   if (filteredProducts.length > 0 && search) {
//     // find all products matching the current search
//     const matchedProducts = filteredProducts.filter(p =>
//       p.productName.toLowerCase().includes(search)
//     );

//     // if at least one match found → set category
//     if (matchedProducts.length > 0) {
//       setCategory(matchedProducts[0].category); // 👈 sets category to the first matching product's category
//     } else {
//       setCategory("All"); // fallback if nothing found
//     }
//   }
// }, [products, search]);





  // console.log("filteredProducts")
  //  console.log(filteredProducts)


  return (



    <>

      <div className="pt-20 pb-10 bg-white min-h-screen l">

        {/* Main Container */}
        <div className="max-w-[1350] mx-auto px-4 flex flex-col lg:flex-row gap-6 align-middle items-top">

          {/* Sidebar (full width on mobile, fixed width on large screens) */}
          <div className="">
            <FilterSlider
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              category={category}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              brand={brand}
              setBrand={setBrand}
            />
          </div>

          {/* Product Section */}
          <div className="flex-1 flex flex-col w-full">

            {/* Sort Section */}
            <div className="mb-4 flex justify-end">
              <select name="sort" id="sort">
                <option value="default">Sort By</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="newestFirst">Newest First</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="
              grid 
              grid-cols-1 
              sm:grid-cols-2
              lg:grid-cols-3 
              xl:grid-cols-4 
              gap-6 
              w-full
          ">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} {...product} loading={loading}  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
 />
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  );


}



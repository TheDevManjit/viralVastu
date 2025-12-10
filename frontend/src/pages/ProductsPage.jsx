import FilterSlider from "@/components/FilterSlider";
import React, { use, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "../api/productApi.js";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Hand } from "lucide-react";
import API_BASE_URL from "@/api/baseUrl.js";







export default function ProductsPage() {

  const { products } = useSelector(store => store.products);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("")

  const dispatch = useDispatch();
  const location = useLocation();

  const [search, setSearch] = useState('');

  useEffect(() => {

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search") || '';

    setSearch(searchQuery.toLowerCase());

    console.log("search quary", searchQuery)
    setBrand("All");
    setCategory(searchQuery)

  }, [location.search]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/product/allProducts`);
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


  const handleSort = (e) => {
    setSort(e.target.value)
    console.log(e.target.value)
  }

  let filteredProducts = products


  filteredProducts = products
    ?.filter(
      (p) => brand === "All" || p.productBrand.toLowerCase() === brand.toLowerCase()
    )
    ?.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    )



  if (search) {
    filteredProducts = products
      ?.filter((prod) => {

        const categoriesInLowerCase = prod.productCategory.map(cat => cat.toLowerCase())
        console.log(categoriesInLowerCase)
        // console.log("search", search.split(/[,]/))
        const searchArray = search.split(/[,]/).map(term => term.trim().toLowerCase());

        return searchArray.some(searchTerm =>
          categoriesInLowerCase.includes(searchTerm))


      })

  }



  if (sort === "priceLowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }
  if (sort === "priceHighToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
  }



  return (



    <>

      <div className="lg:pt-20 pt-34 pb-10 bg-white min-h-screen l">

        {/* Main Container */}
        <div className="max-w-[1350] mx-auto px-4 flex flex-col lg:flex-row gap-6 align-middle items-top">

          {/* Sidebar (full width on mobile, fixed width on large screens) */}
          <div className="">
            <FilterSlider
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              category={category}
              brand={brand}
              setBrand={setBrand}
            />
          </div>

          {/* Product Section */}
          <div className="flex-1 flex flex-col w-full">

            {/* Sort Section */}
            <div className="mb-4 flex lg:justify-end justify-start">
              <select name="sort" id="sort" onChange={handleSort}>
                <option value="default">Sort By</option>
                <option value="priceLowToHigh" onClick={() => { sorting('lowToHigh') }}>Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                {/* <option value="newestFirst">Newest First</option> */}
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
                <ProductCard key={product._id} {...product} loading={loading} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  );


}



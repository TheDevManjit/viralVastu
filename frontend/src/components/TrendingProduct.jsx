import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Grid, IconButton, Typography, Card, CardMedia, CardContent } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice.js";
import axios from "axios";
import { getAllProducts } from "../api/productApi.js";
import { toast } from "sonner";
import ProductCarousel from "./ProductCarousel.jsx";
import ProductCard from "./ProductCard.jsx";
import { Link } from "react-router-dom";




export default function TrendingProduct() {
    const [activeTab, setActiveTab] = useState(0);
    const { products } = useSelector((store) => store.products);
    const dispatch = useDispatch();




    useEffect(() => {
        // Fetch products or any other data if needed
        try {
            const fetchData = async () => {
                const res = await axios.get("http://localhost:5000/api/v1/product/allProducts");
                if (res.data.success) {
                    dispatch(setProducts(res.data.products));
                }
            };

            fetchData();
        } catch (error) {
            toast.error("Error fetching products:", error);
        }
    }, [dispatch]);

    const uniqueCategories = ["All", ...new Set(products.map((prod) => prod.productCategory))];

    const filteredProducts =
        activeTab === 0
            ? products
            : products.filter((prod) => prod.productCategory === uniqueCategories[activeTab]);


   

    return (
        <Box className="w-full mt-10">
            <h3 className="text-center text-2xl font-semibold mt-20 mb-5">Trending now</h3>
            <div >
                <div className=" flex justify-center mb-6 ">
                    <Tabs
                        value={activeTab}
                        onChange={(e, val) => setActiveTab(val)}
                        centered
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            backgroundColor: "#f9fafb",
                            borderRadius: 3,
                            "& .MuiTab-root": { textTransform: "none", fontSize: "1rem", fontWeight: 500 },
                            "& .Mui-selected": { backgroundColor: "#fff", borderRadius: "8px" },
                        }}
                    >
                        {uniqueCategories.map((cat) => (
                            <Tab key={cat} label={cat} />
                        ))}
                    </Tabs>
                </div>

                {/* Product Grid */}



                <div className=" w-full flex justify-center gap-10 flex-wrap ">

                    {
                        filteredProducts.slice(0, 4).map((product) => (
                            <div className="w-[250px] cursor-pointer">
                                <Link to={`/product/${product._id}`}>
                                    <ProductCarousel key={product._id} productImg={product.productImg} />
                                    <p className="line-clamp-2">{product.productName.slice(0, 10)}...</p>
                                    <p className="font-bold">₹ {product.productPrice}</p>
                                    {product.productOriginalPrice && (
                                        <span className="text-gray-400 line-through">
                                            ₹{product.productOriginalPrice}
                                        </span>
                                    )}

                                    {product.productOriginalPrice && (
                                        <span className="text-[12px] text-green-600 font-semibold">
                                            {Math.round(((product.productOriginalPrice - product.productPrice) / product.productOriginalPrice) * 100)}% off
                                        </span>)}
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/* Tabs */}



        </Box>
    );
}

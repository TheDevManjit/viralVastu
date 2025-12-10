import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Category from "@/components/Category";
import TrendingProduct from "@/components/TrendingProduct";



export default function HomePage() {

  

    return (

        <>
            <Hero />
            <Category />
            <TrendingProduct />
            <Features />
           
        </>


    )

}
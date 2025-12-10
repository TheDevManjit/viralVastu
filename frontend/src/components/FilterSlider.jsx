import React from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

export default function FilterSlider({
  category,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
}) {
  const { products } = useSelector((store) => store.products);
  const uniqueBrands = ["All", ...new Set(products.map((p) => p.productBrand))];

  // Handlers


  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  console.log(category)

  const resetFilters = () => {
    setSearch("");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64">
      {/* Category */}
      <h2 className="mt-5 font-semibold text-xl">Categories</h2>
      <div className="flex flex-col gap-2 mt-3">
        <span>{category.split(/[,]/)[0].toUpperCase()}</span>
      </div>

      {/* Brands */}
      <h2 className="mt-5 font-semibold text-xl">Brands</h2>
      <select
        className="w-full mt-2 p-2 rounded border bg-white"
        value={brand}
        onChange={handleBrandChange}
      >
        {uniqueBrands.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      {/* Price range */}
      <h2 className="mt-5 font-semibold text-xl">Price Range</h2>
      <div className="bg-white w-full rounded-md p-2 mt-2 border">
        <p>
          ₹{priceRange[0]} - ₹{priceRange[1]}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            value={priceRange[0]}
            min="0"
            onChange={handleMinChange}
            className="w-20 p-1 border rounded"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            min="0"
            onChange={handleMaxChange}
            className="w-20 p-1 border rounded"
          />
        </div>

        {/* Range sliders */}
        <input
          type="range"
          min="0"
          max="50000"
          value={priceRange[0]}
          onChange={handleMinChange}
          className="w-full mt-2"
        />

        <input
          type="range"
          min="0"
          max="50000"
          value={priceRange[1]}
          onChange={handleMaxChange}
          className="w-full"
        />
      </div>

      <Button
        className="bg-[#9846e8] text-white w-full mt-5 hover:bg-[#7b26cf]"
        onClick={resetFilters}
      >
        Reset Filter
      </Button>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Category() {
    const menus = [
        {
            img: "/img1.jpeg",
            title: "Personal Care",
            link: "accessories",
        },
        {
            img: "/a.jpeg",
            title: "Accessories",
            link: "accessories",
        },
        {
            img: "/homedecor.jpeg",
            title: "Home Decor",
            link: "home decor",
        },
    ];

    const navigate = useNavigate();

    const handleClick = (e) => {
        // Implement navigation or any other logic here
       navigate(`/product?search=${e}`);
        console.log(`Navigating to ${e}`);
    };

    return (
        <div className="mt-10">
            <div className="flex flex-wrap justify-center gap-16 md:gap-20">
                {menus.map((menu, index) => (
                    
                        <div className="cursor-pointer" onClick={() => handleClick(menu.link)} key={index}>
                            <div className="bg-gray-200 p-2 rounded-full flex items-center cursor-pointer justify-center shadow-md">
                                <img
                                    src={menu.img}
                                    alt={menu.title}
                                    className="w-28 h-28 rounded-full object-cover cursor-pointer "
                                />
                            </div>
                            <p className="mt-2 font-medium text-gray-700 group-hover:text-blue-600 cursor-pointer ">
                                {menu.title}
                            </p>
                        </div>

                   
                ))}
            </div>
        </div>
    );
}

export default Category;

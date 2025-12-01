import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Menu, X, ShoppingCart, UserRound, Home } from "lucide-react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { getAllProducts } from "@/api/productApi";
import { fetchCart } from "@/redux/cartSlice";




const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { cart, loading, error } = useSelector((state) => state.cart)

    const { user } = useSelector(store => store.user)
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem('accessToken')
    const navigate = useNavigate()


    const logoutHandler = async () => {

        try {
            const res = await axios.post(`http://localhost:5000/api/v1/user/logout/`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`

                }
            })
            if (res.data.success) {
                dispatch(setUser(null))
                toast.success(res.data.message)
                localStorage.removeItem('accessToken');
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }



    //console.log(cart)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                setAllProducts(products);
            } catch (error) {
                console.error("Error fetching products for search:", error);
            }
        };

        fetchProducts();

    }, []);

 

    useEffect(() => {
        dispatch(fetchCart()) // this triggers the thunk
    }, [dispatch])

  console.log(cart.items)

    useEffect(() => {
        if (!search.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = allProducts.filter((p) =>
            p.productName.toLowerCase().includes(search.toLowerCase()) ||
            p.productBrand.toLowerCase().includes(search.toLowerCase()) ||
            p.productCategory.toLowerCase().includes(search.toLowerCase())
        );

        setSuggestions(filtered.slice(0, 7)); // top 7 results
    }, [search, allProducts]);


    const handleSelectSuggestion = (value) => {
        navigate(`/product?search=${value}`);

        setSuggestions([]);

    };

   

    if (loading) return <p>Loading...</p>
    if (error) toast.error(error.message)

    return (
        <nav className="w-full text-white bg-linear-to-r from-blue-500 to-blue-600 fixed top-0 left-0 z-50 shadow-sm">
            <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-50 w-auto object-contain overflow-hidden mt-2"
                        />
                    </Link>

                    {/* Search Bar (hide on mobile) */}
                    <div className=" md:flex md:w-[300px] lg:w-[600px] relative w-[70vh] me-4">
                        <Input
                            className="pl-10 pr-3 py-2 border border-white bg-white text-black rounded-xl focus:ring-2 focus:ring-white focus:outline-none w-full"
                            placeholder="Search for products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5  w-5 h-5" />

                        {/* 🔥 Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute text-black bg-gray-100! shadow-lg border rounded-md w-full mt-10 max-h-80 overflow-y-auto z-50">
                                {suggestions.map((item) => (
                                    <div
                                        key={item._id}
                                        onClick={() => handleSelectSuggestion(item.productCategory)}
                                        className="px-4 py-2 hover:bg-white cursor-pointer"
                                    >
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.productBrand} • {item.productCategory}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6 ">


                        <Link
                            to="/product"
                            className="hover:text-green-600 border border-transparent transition font-medium hover:border hover:border-[#676D6C]  rounded p-1  "
                        >
                            Products
                        </Link>






                        {user ?
                            <div className="relative group">
                                {/* <!-- Profile --> */}
                                <div
                                    className="flex items-center gap-2 hover:text-green-600 border border-transparent transition font-medium hover:border hover:border-[#676D6C] rounded p-1 cursor-pointer"
                                >
                                    <UserRound size={18} />
                                    <span>{user.firstName}</span>
                                </div>

                                {/* <!-- Submenu --> */}
                                <div
                                    className="absolute right-0 mt-1 -translate-y-1 hidden w-40 bg-white shadow-md rounded-md group-hover:flex flex-col z-50"
                                    id="sub-menu"
                                >
                                    <ul className="py-2 text-sm text-white bg-gray-700 rounded-md">
                                        <Link to={`/profile/${user._id}`}>
                                            <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">My Profile</li>
                                        </Link>

                                        <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Orders</li>
                                    </ul>
                                </div>
                            </div>




                            :
                            <Link
                                to={'login'}

                                className="flex items-center gap-2 text-gray-700 hover:text-green-600 border border-transparent transition font-medium hover:border hover:border-[#676D6C]  rounded p-1"
                            >
                                <UserRound size={18} />
                                <span>Profile</span>
                            </Link>
                        }

                        <Link
                            to="/cart"
                            className="relative hover:text-green-600 transition"
                            
                        > {
                            
                        }

                         <ShoppingCart size={22} />
                            <span className="bg-green-500 text-white rounded-full text-xs absolute -top-2 -right-3 px-1.5">
                                { cart.items ? cart.items.length : 0  }
                            </span>
                           
                        </Link>
                        {
                            user ?
                                <Link

                                    className="text-gray-700 hover:text-green-600 border border-transparent transition font-medium cursor-pointer  rounded p-1  "
                                >
                                    <Button className="bg-red-300 cursor-pointer text-black hover:bg-red-500" onClick={logoutHandler}> logout </Button>
                                </Link>
                                :

                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-green-600  "
                                >
                                    <Button className="bg-green-200 cursor-pointer text-black hover:bg-green-500" > LogIn</Button>
                                </Link>
                        }



                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-green-700 hover:text-green-600 transition"
                        >
                            {open ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-green-100 shadow-sm transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <Link
                            to="/dashboard"
                            onClick={() => setOpen(false)}
                            className="text-gray-700 hover:text-green-600 font-medium transition "
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setOpen(false)}
                            className="text-gray-700 hover:text-green-600 font-medium transition"
                        >
                            Contact Us
                        </Link>

                        {user && (
                            <Link
                                to="/profile"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                            >
                                <UserRound size={18} />
                                <span>Profile</span>
                            </Link>
                        )}

                        <Link

                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                        >
                            <ShoppingCart size={20} />
                            <span>{items.items.length}</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

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

const Navbar = ({ classes }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

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
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

  

   



    return (
        <nav className={`${classes} bg-white/90 backdrop-blur-sm border-b border-green-100   shadow-sm`}>
            <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex justify-between items-center h-16">
                    <div>
                        <h3 className="text-sky-400 text-3xl">Welcome : <span className="text-2xl">{user.firstName + " " + user.lastName}</span></h3>
                    </div>
                    <div className="absolute right-10">

                        
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
                            to="/cart"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                        >
                            <ShoppingCart size={20} />
                            <span>Cart (1)</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, UserRound, Search as SearchIcon, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { getAllProducts } from "@/api/productApi";
import { fetchCart } from "@/redux/cartSlice";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const drawerRef = useRef(null);
  const searchRef = useRef(null);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/user/logout/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products || []);
      } catch (err) {
        console.error("Error fetching products for search:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts.filter((p) => {
      const inName = p.productName?.toLowerCase().includes(q);
      const inBrand = p.productBrand?.toLowerCase().includes(q);
      const inCat = Array.isArray(p.productCategory)
        ? p.productCategory.some((c) => c.toLowerCase().includes(q))
        : false;
      return inName || inBrand || inCat;
    });

    setSuggestions(filtered.slice(0, 7));
  }, [search, allProducts]);

  const handleSelectSuggestion = (item) => {
    const firstCat = Array.isArray(item.productCategory)
      ? item.productCategory[0]
      : "";
    const destinationValue =
      firstCat?.toLowerCase().includes(search.trim().toLowerCase()) && firstCat
        ? firstCat
        : item.productName;

    navigate(`/product?search=${encodeURIComponent(destinationValue)}`);
    setSuggestions([]);
    setDrawerOpen(false);
  };

  // Drawer close logic
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const onClickAway = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClickAway);
      setTimeout(() => searchRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickAway);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (loading) return <p>Loading...</p>;

  const cartCount = cart?.items?.length || 0;

  return (
    <>
      {/* ✅ DESKTOP NAV */}
      <nav className="w-full hidden md:flex text-white bg-linear-to-r from-blue-500 to-blue-600 fixed top-0 left-0 z-50 shadow-sm">
        <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-center items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-50 w-auto object-contain overflow-hidden mt-2"
              />
            </Link>

            {/* Search */}
            <div className="md:flex md:w-[300px] lg:w-[600px] relative w-[70vh] me-4">
              <Input
                className="pl-10 pr-3 py-2 border border-white bg-white text-black rounded-xl focus:ring-2 focus:ring-white focus:outline-none w-full"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 w-5 h-5" />

              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 text-black bg-white shadow-lg border rounded-md w-full max-h-80 overflow-y-auto z-50">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.productBrand} •{" "}
                        {Array.isArray(item.productCategory)
                          ? item.productCategory[0]
                          : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/product"
                className="hover:text-green-600 border border-transparent transition font-medium hover:border hover:border-[#676D6C] rounded p-1"
              >
                Products
              </Link>

              {user ? (
                <div className="relative group flex items-center gap-2">
                  <UserRound size={18} />
                  <span>{user.firstName}</span>
                  <div className="hidden group-hover:flex absolute w-30 h-24 bg-white top-6 rounded text-black transition delay-150 duration-300 ease-in-out">
                   <ul className="p-2">
                    <li className="hover:bg-gray-200 rounded p-2">
                        <Link to={`profile/:userId`}>Profile</Link>
                    </li>
                    <li className="hover:bg-gray-200 rounded p-2">
                        <Link to={`/orders`}>Orders</Link>
                    </li>
                    
                   </ul>

                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-100 border border-transparent transition font-medium rounded p-1"
                >
                  <UserRound size={18} />
                  <span>Profile</span>
                </Link>
              )}

              <Link to="/cart" className="relative hover:text-green-200 transition">
                {user && (
                  <>
                    <ShoppingCart size={22} />
                    <span className="bg-green-500 text-white rounded-full text-xs absolute -top-2 -right-3 px-1.5">
                      {cartCount}
                    </span>
                  </>
                )}
              </Link>

              {user ? (
                <Button
                  className="bg-red-300 text-black hover:bg-red-500"
                  onClick={logoutHandler}
                >
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="bg-green-200 text-black hover:bg-green-500">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ MOBILE NAV */}
      <nav className="w-full md:hidden text-white bg-linear-to-r from-blue-500 to-blue-600 fixed top-0 left-0 z-50 shadow-sm">
        <div className="max-w-[100vw] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-50 w-auto object-contain overflow-hidden mt-2"
              />
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                {user && (
                  <>
                    <ShoppingCart size={22} />
                    <span className="bg-green-500 text-white rounded-full text-xs absolute -top-2 -right-3 px-1.5">
                      {cartCount}
                    </span>
                  </>
                )}
              </Link>

              {user ? (
                <Link to={`/profile/${user._id}`} className="flex items-center gap-1">
                  <UserRound size={20} />
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-1">
                  <UserRound size={20} />
                </Link>
              )}

              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer */}
        <div
          className={`fixed inset-0 z-[60] transition-opacity ${
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            ref={drawerRef}
            className={`absolute right-0 top-0 h-full w-[88vw] max-w-sm bg-white text-black shadow-xl transition-transform duration-300 ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            } flex flex-col`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X />
              </button>
            </div>

            {/* Search */}
           

            {/* Links */}
            <div className="p-2 grow overflow-y-auto">
              <Link
                to="/product"
                onClick={() => setDrawerOpen(false)}
                className="block px-4 py-3 rounded-md hover:bg-gray-100"
              >
                Products
              </Link>

              {user && (
                <>
                  <Link
                    to={`/profile/${user._id}`}
                    onClick={() => setDrawerOpen(false)}
                    className="block px-4 py-3 rounded-md hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDrawerOpen(false)}
                    className="block px-4 py-3 rounded-md hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              {user ? (
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    logoutHandler();
                    setDrawerOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={() => setDrawerOpen(false)}>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

         <div className="p-4 border-b relative">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <Input
                  ref={searchRef}
                  className="pl-10 pr-3 h-11 bg-white text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Search for products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      navigate(`/product?search=${encodeURIComponent(search.trim())}`);
                      setDrawerOpen(false);
                      setSuggestions([]);
                    }
                  }}
                />
              </div>

              {suggestions.length > 0 && (
                <div className="mt-2 text-black bg-white shadow-lg border rounded-md w-full max-h-80 overflow-y-auto z-50">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.productBrand} •{" "}
                        {Array.isArray(item.productCategory)
                          ? item.productCategory[0]
                          : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
      </nav>
    </>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import API_BASE_URL from "@/api/baseUrl";


export default function LoginPage() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const dispatch = useDispatch()


    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value

        }))

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                localStorage.setItem('accessToken', res.data.accessToken)
                // localStorage.setItem('user', JSON.stringify(res.data.user)) // Handled in slice now
                navigate("/")
                toast.success(res.data.message)

            } else {
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }

    }

    // Simple forgot password handler for now, can be expanded
    const handleForgotPasswordClick = () => {
        // This logic can be moved to a separate route or modal if needed, 
        // but keeping the link to a dedicated page or state is fine.
        // For now, let's just use the state toggle or link if the user wants.
        // The original code had a toggle, but a dedicated page or modal is cleaner.
        // Let's stick to the previous inline logic or better, just a link/toast for now 
        // since the user request was about UI beautification.
        // Wait, the original code had inline forgot pass. I will make it a link to a clearer UI.

        // Using the existing endpoint logic if needed, but for "beautification" 
        // I'll keep it simple or assume there's a route. 
        // The original code had a toggle state `forgotPass`. I will re-implement that cleanly if needed,
        // but a cleaner approach for "production ready" is usually a separate page or a clean modal.
        // Given the constraints, I will implement the toggle view within the card nicely.
    };

    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleForgotPassSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/api/v1/user/forgotpassword`, { email: formData.email });
            if (response.data.success) {
                navigate("/emailsent");
                toast.success("Reset link sent!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-black/80" />
                </div>

                <div className="relative z-10">
                    {/* <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto invert brightness-0 filter" />
                        ViralVastu
                    </Link> */}
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
                        Discover the <span className="text-blue-400">Perfect Vastu</span> for Your Home
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Join thousands of happy customers transforming their living spaces with positive energy and premium layouts.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-semibold text-white">2k+ Happy Customers</span>
                            <div className="flex text-yellow-500 text-xs">
                                ★★★★★
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-500">
                    © 2024 ViralVastu. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 lg:bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {isForgotPassword ? "Reset Password" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isForgotPassword
                                ? "Enter your email to receive a reset link"
                                : "Please enter your details to sign in"}
                        </p>
                    </div>

                    <Card className="border-none shadow-xl bg-white">
                        <CardHeader className="space-y-1 pb-2">
                            {/* Optional header content inside card if needed */}
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={isForgotPassword ? handleForgotPassSubmit : handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="sr-only">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {!isForgotPassword && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" classname="sr-only">Password</Label>
                                            <button
                                                type="button"
                                                onClick={() => setIsForgotPassword(true)}
                                                className="text-xs font-medium text-blue-600 hover:text-blue-500"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        isForgotPassword ? "Send Reset Link" : "Sign In"
                                    )}
                                    {!loading && !isForgotPassword && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="text-center space-y-4">
                        {isForgotPassword ? (
                            <button
                                onClick={() => setIsForgotPassword(false)}
                                className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                            >
                                Back to Login
                            </button>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                                    Create one now
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

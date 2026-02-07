import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye, Loader2, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import API_BASE_URL from "@/api/baseUrl";


export default function SignupPage() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);

    // OTP State
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [cooldown, setCooldown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const MAX_RESENDS = 3;

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ""
    })

    const location = useLocation();
    const dispatch = useDispatch()
    const queryParams = new URLSearchParams(location.search);
    const urlEmail = queryParams.get("email");

    // Check if we are in verification mode from URL
    useEffect(() => {
        if (urlEmail) {
            setOtpSent(true);
            setFormData(prev => ({ ...prev, email: urlEmail }));
        }
    }, [urlEmail]);

    // Timer for OTP cooldown
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);


    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isValidPassword.test(formData.password)) {
            toast.error("Password must include uppercase, lowercase, number, and special character")
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return;
        }

        try {
            setLoading(true)
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/register`, formData, {
                headers: { "Content-Type": "application/json" }
            })

            if (res.data.success) {
                setOtpSent(true)
                // navigate(`/signup?email=${res.data.user.email}`) // Optional: update URL
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }


    const handleOtpVerification = async (e) => {
        e.preventDefault();
        try {
            if (otp.length < 6) {
                toast.error("Please enter a valid 6-digit OTP");
                return;
            }
            setLoading(true);

            // Use formData.email or urlEmail
            const emailToVerify = formData.email || urlEmail;

            const res = await axios.post(
                `${API_BASE_URL}/api/v1/user/varifyotp/${emailToVerify}`,
                { otp }
            );

            const { success, message, user, accessToken } = res.data;

            if (success) {
                if (!accessToken) {
                    toast.error("Access token missing from response");
                    return;
                }

                toast.success("Welcome to ViralVastu!");
                dispatch(setUser(user));
                localStorage.setItem("accessToken", accessToken);
                // localStorage.setItem("user", JSON.stringify(user)); // Handled in slice
                setOtp("");
                navigate("/");
            } else {
                toast.error(message || "Verification failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const handleResendOtp = async () => {
        if (resendCount >= MAX_RESENDS) {
            toast.error("Maximum resend attempts reached!");
            return;
        }
        if (cooldown > 0) return;

        try {
            // Use formData.email or urlEmail
            const emailToVerify = formData.email || urlEmail;
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/user/resend-otp/${emailToVerify}`
            );

            if (res.data.success) {
                toast.success("OTP resent successfully!");
                setCooldown(60);
                setResendCount((prev) => prev + 1);
            } else {
                toast.error(res.data.message || "Failed to resend OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };


    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 to-black/80" />
                </div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto invert brightness-0 filter" />
                        ViralVastu
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <blockquote className="text-2xl font-medium leading-relaxed italic text-gray-200">
                        "The best investment you can make is in the energy of your own home."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-700"></div>
                        <span className="text-sm font-semibold text-gray-400">JOIN OUR COMMUNITY</span>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-500">
                    © 2024 ViralVastu. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 lg:bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-8 py-10">

                    {!otpSent ? (
                        /* REGISTRATION FORM */
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Enter your details below to create your account
                                </p>
                            </div>

                            <Card className="border-none shadow-xl bg-white">
                                <CardContent className="pt-6">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="sr-only">First Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="firstName"
                                                        name="firstName"
                                                        placeholder="First Name"
                                                        className="pl-10 bg-gray-50 border-gray-200"
                                                        required
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    className="bg-gray-50 border-gray-200"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="sr-only">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    className="pl-10 bg-gray-50 border-gray-200"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" classname="sr-only">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Create a password"
                                                    className="pl-10 bg-gray-50 border-gray-200"
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

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" classname="sr-only">Confirm Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Confirm password"
                                                    className="pl-10 bg-gray-50 border-gray-200"
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* OTP VERIFICATION VIEW */
                        <>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Verify your email</h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    We sent a verification code to <span className="font-semibold text-gray-900">{formData.email}</span>
                                </p>
                            </div>

                            <Card className="border-none shadow-xl bg-white">
                                <CardContent className="pt-8">
                                    <form onSubmit={handleOtpVerification} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp" className="sr-only">OTP</Label>
                                            <Input
                                                id="otp"
                                                name="otp"
                                                placeholder="Enter 6-digit code"
                                                className="bg-gray-50 border-gray-200 text-center text-2xl tracking-widest h-14"
                                                required
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading || otp.length < 6}
                                            className="w-full h-10 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                                        <button
                                            onClick={handleResendOtp}
                                            disabled={cooldown > 0 || resendCount >= MAX_RESENDS}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                                        >
                                            {cooldown > 0
                                                ? `Resend in ${cooldown}s`
                                                : resendCount >= MAX_RESENDS
                                                    ? "Max attempts reached"
                                                    : "Click to resend"}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="text-center text-sm text-gray-600">
                                <button onClick={() => setOtpSent(false)} className="text-gray-500 hover:text-gray-900 underline">
                                    Change email address
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

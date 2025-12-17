import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import API_BASE_URL from "@/api/baseUrl";







export default function SignupPage() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [otpSend, setOtpSend] = useState(false)
    const [otp, setotp] = useState("")
    const [cooldown, setCooldown] = useState(0); // in seconds
    const [resendCount, setResendCount] = useState(0);
    const MAX_RESENDS = 3;
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
    const email = queryParams.get("email");
   // console.log(email)

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value

        }))

    }

    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(""); // clear previous error

        // ✅ validation checks
        if (!isValidPassword.test(formData.password)) {
            // setError("Password must include uppercase, lowercase, number, and special character");
            toast.error(error)
            return; // stop here
        }

        if (formData.password !== formData.confirmPassword) {
            // setError("Passwords do not match");
            toast.error(error)
            return; // stop here
        }
        try {
            setLoading(true)
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.data.success) {
                setOtpSend(true)
                navigate(`/signup?email=${res.data.user.email}`)
                toast.success(res.data.message)
            }

        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }

    }


    const handleOtpVerification = async () => {
        try {
            if (otp.length < 6) {
                toast.error("Please enter a valid 6-digit OTP");
                return;
            }

            const res = await axios.post(
                `${API_BASE_URL}/api/v1/user/varifyotp/${email}`,
                { otp }
            );

            const { success, message, user, accessToken } = res.data;

            if (success) {
                if (!accessToken) {
                    toast.error("Access token missing from response");
                    return;
                }

                toast.success("OTP verified successfully! Welcome");
                dispatch(setUser(user));
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("user", JSON.stringify(user));
                setotp("");
                navigate("/");
            } else {
                toast.error(message || "Verification failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };


    const handleResendOtp = async (e) => {
         e.preventDefault();
        if (resendCount >= MAX_RESENDS) {
            toast.error("Maximum resend attempts reached!");
            return;
        }

        if (cooldown > 0) {
            toast.error(`Please wait ${cooldown}s before resending`);
            return;
        }

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/user/resend-otp/${email}`
            );

            if (res.data.success) {
                toast.success("OTP resent successfully!");
                setCooldown(60); // 1-minute cooldown
                setResendCount((prev) => prev + 1);
            } else {
                toast.error(res.data.message || "Failed to resend OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };


    return (

        <div className="items-center min-h-screen flex mt-4 justify-center bg-sky-100 pt-10  relative">
            <div className="md:w-[750px] w-full   md:grid grid-cols-2 gap-2 bg-linear-to-r from-blue-400 to-blue-200 p-5 rounded m">
                <div className="max-w-sm md:mt-5 hidden md:flex flex-col">
                    <p className="text-3xl font-bold flex flex-col justify-between gap-4">Explore <span className="text-yellow-300 font-extrabold">Biggest Collection</span>  of <span className="text-yellow-300 font-extrabold" > Trending Products</span></p>
                    <img src="logo.png" alt="" className="w-40 scale-200 self-baseline" />
                </div>

                {
                    otpSend ?
                        <Card className="mt-20 lg:mt-0">
                            <CardHeader>
                                <CardTitle> PLease Enter Your 6 Digit otp </CardTitle>
                                <CardDescription>
                                    Check Your Mail
                                </CardDescription>

                            </CardHeader>
                            <CardContent>

                                <div className=" flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Input
                                                id="otp"
                                                type="text"
                                                name="otp"
                                                placeholder="Enter Otp"
                                                required
                                                value={otp}
                                                onChange={(e) => setotp(e.target.value)}
                                                maxLength={6}
                                            />

                                            <button className="decoration-underline" onClick={handleResendOtp} disabled={cooldown > 0 || resendCount >= MAX_RESENDS}>
                                                {cooldown > 0
                                                    ? `We can again Resend OTP in ${cooldown}s`
                                                    : resendCount >= MAX_RESENDS
                                                        ? "Limit reached"
                                                        : " Don't Receive ? Resend OTP"}
                                            </button>

                                        </div>



                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full cursor-pointer bg-green-700 hover:bg-green-500" onClick={handleOtpVerification}>
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading </> : "varify"}
                                </Button>


                            </CardFooter>
                        </Card>
                        :
                        <Card className="mt-20 lg:mt-0">
                            <CardHeader>
                                <CardTitle> Register Here </CardTitle>
                                <CardDescription>
                                    Enter given detils for register
                                </CardDescription>

                            </CardHeader>
                            <CardContent>

                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                name="firstName"
                                                placeholder="Enter your first name"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />

                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter your Last name"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />

                                        </div>

                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="m@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}

                                        />
                                    </div>
                                    <div className="grid gap-2 relative">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <div className="relative">
                                            <Input id="password"
                                                name='password'
                                                placeholder="Enter Password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            {
                                                showPassword ? <EyeOff onClick={() => setShowPassword(false)} className=" cursor-pointer w-5 h-5 text-gray-700 absolute right-5 bottom-2" /> :
                                                    <Eye onClick={() => setShowPassword(true)} className="cursor-pointer w-5 h-5 text-gray-700 absolute right-5 bottom-2" />
                                            }


                                        </div>
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <div className="relative">
                                            <Input id="confirmPassword"
                                                name='confirmPassword'
                                                placeholder="Confirm Password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                            {
                                                showPassword ? <EyeOff onClick={() => setShowPassword(false)} className=" cursor-pointer w-5 h-5 text-gray-700 absolute right-5 bottom-2" /> :
                                                    <Eye onClick={() => setShowPassword(true)} className="cursor-pointer w-5 h-5 text-gray-700 absolute right-5 bottom-2" />
                                            }


                                        </div>

                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full cursor-pointer bg-green-700 hover:bg-green-500" onClick={handleSubmit}>
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading </> : "signup"}
                                </Button>
                                <p className=" text-gray-700 text-sm">Already Have An Account? <Link to={"/login"} className="hover:underline cursor-pointer text-green-500">logIn</Link> </p>

                            </CardFooter>
                        </Card>
                }


            </div>

        </div>
    )

}


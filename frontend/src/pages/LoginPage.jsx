import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom"
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
import { useDispatch, } from "react-redux";
import { setUser } from "@/redux/userSlice";
import API_BASE_URL from "@/api/baseUrl";


export default function loginPage() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [forgotPass, setForgotPass] = useState(false)
    const [error, setError] = useState('')
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
        //   console.log(formData)
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
                localStorage.setItem('user', res.data.user)
                navigate("/")
                toast.success(res.data.message)

            } else {
                toast.success(res.data.message)
            }

        } catch (error) {
            // console.log ("THis is Error message",error)
            toast.error(error.response.data.message)
            setError(error.response.data.message)
        } finally {
            setLoading(false)
            // setError("")
        }

    }

    const handleForgotPass = async () => {
        const email = formData.email
        console.log(email)
        try {
            setLoading(true)
            const response = await axios.post(`${API_BASE_URL}/api/v1/user/forgotpassword`, { email })
            if (response.data.success) {
                navigate("/emailsent")
            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong")
        }finally {
            setLoading(false)
            
        }
    }

    return (

        <div className=" items-center min-h-screen flex  justify-center bg-sky-100 pt-10 relative">
            <div className=" w-full md:w-[750px] md:grid grid-cols-2 gap-4 bg-linear-to-r from-blue-400 to-blue-200 p-5 rounded m">
                <div className="max-w-sm mt-24 md:mt-10 hidden md:flex flex-col">
                    <p className="text-3xl font-bold flex flex-col justify-between gap-2">Explore <span className="text-yellow-300 font-extrabold">Biggest Collection</span>  of <span className="text-yellow-300 font-extrabold" > Trending Products</span></p>
                    <img src="logo.png" alt="" className="w-40 scale-200 self-baseline" />
                </div>
                <Card className="w-full md:max-w-sm  h-[350px] justify-center">
                    <CardHeader>
                        <CardTitle className="text-center"> Welcome </CardTitle>
                        <CardDescription className="text-center">
                            Enter given details for Login
                        </CardDescription>

                    </CardHeader>
                    <CardContent>

                        <div className="flex flex-col gap-6 ">

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
                            {(
                                !forgotPass &&
                                <div className="grid gap-2">
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

                                </div>
                            )}


                        </div>
                        {
                            error &&
                            <span className="text-red-600"> {error}  </span>
                        }
                         
                        {(
                            !forgotPass ?
                                <span className="text-sm mx-2  hover:underline cursor-pointer hover:text-yellow-600"><Link

                                    onClick={() => setForgotPass((prev) => !prev)}

                                >Forgot Password ?</Link></span>
                                :

                                <span className="text-sm mx-2 cursor-pointer hover:underline hover:text-yellow-600"><Link

                                    onClick={() => setForgotPass((prev) => !prev)}

                                >Log In ?</Link></span>
                        )}


                    </CardContent>

                    <CardFooter className="flex-col gap-2">
                        {(
                            !forgotPass ?
                                <Button type="submit" className="w-full cursor-pointer bg-green-700 hover:bg-green-500" onClick={handleSubmit}>
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading </> : "Log In"}
                                </Button>
                                :
                                <Button type="submit" className="w-full cursor-pointer bg-green-700 hover:bg-green-500" onClick={handleForgotPass}>
                                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading </> : "submit"}
                                </Button>
                        )}


                        <p className=" text-gray-700 text-sm"> Don't Have An Account? <Link to={"/signup"} className="hover:underline cursor-pointer text-green-500">Register Here</Link> </p>

                    </CardFooter>
                </Card>

            </div>

        </div>
    )

}


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Link, useParams, } from "react-router-dom";
import { useNavigate } from "react-router-dom"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner"
import axios from "axios";







export default function ChangePassword() {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({

        newPassword: '',
        confirmNewPassword: ""
    })
    const { token } = useParams();



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
        setError(""); // clear previous error

        // ✅ validation checks
        if (!isValidPassword.test(formData.newPassword)) {

           toast.error("Password must include uppercase, lowercase, number, and special character");
            return; // stop here
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
           toast.error("Passwords do not match");
            return; // stop here
        }
        try {
            setLoading(true)
            const response = await axios.post(`http://localhost:5000/api/v1/user/changepassword`,
                { newPassword: formData.newPassword, confirmNewPassword: formData.confirmNewPassword }
                ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ send token in headers
                    },
                }

            )

            if (response.data.success) {
                toast.success(response.data.message)
                 navigate("/login")
            }


        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            setLoading(false)
        }

    }







    return (

        <div className="items-center min-h-screen flex   justify-center bg-sky-100 pt-10 relative">
            <div className="md:w-[750px] w-full md:grid grid-cols-2 gap-4 bg-linear-to-r from-blue-400 to-blue-200 p-5 rounded m">
                <div className="max-w-sm mt-5">
                    <p className="text-3xl font-bold flex flex-col justify-between gap-4">Explore <span className="text-yellow-300 font-extrabold">Biggest Collection</span>  of <span className="text-yellow-300 font-extrabold" > Trending Products</span></p>
                    <img src="logo.png" alt="" className="w-40 scale-200 self-baseline" />
                </div>


                <Card className=" ">
                    <CardHeader>
                        <CardTitle> Reset Password </CardTitle>


                    </CardHeader>
                    <CardContent>

                        <div className="flex flex-col gap-6">

                            <div className="grid gap-2 relative">
                                <div className="flex items-center">
                                    <Label htmlFor="newpassword">New Password</Label>
                                </div>
                                <div className="relative">
                                    <Input id="newpassword"
                                        name='newPassword'
                                        placeholder="Enter Password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                    {
                                        showPassword ? <EyeOff onClick={() => setShowPassword(false)} className=" cursor-pointer w-5 h-5 text-gray-700 absolute right-5 bottom-2" /> :
                                            <Eye onClick={() => setShowPassword(true)} className="cursor-pointer w-5 h-5 text-gray-700 absolute right-5 bottom-2" />
                                    }


                                </div>
                                <div className="flex items-center">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                </div>
                                <div className="relative">
                                    <Input id="confirmNewPassword"
                                        name='confirmNewPassword'
                                        placeholder="Confirm Password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmNewPassword}
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
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading </> : "Submit"}
                        </Button>
                        <p className=" text-gray-700 text-sm">Already Have An Account? <Link to={"/login"} className="hover:underline cursor-pointer text-green-500">logIn</Link> </p>

                    </CardFooter>
                </Card>



            </div>

        </div>
    )

}


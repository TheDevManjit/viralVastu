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
import { useDispatch,} from "react-redux";
import { setUser } from "@/redux/userSlice";







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
        console.log(formData)
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:5000/api/v1/admin/admin-login', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                localStorage.setItem('accessToken',res.data.accessToken)
                navigate("/")
                toast.success(res.data.message)
            }

        } catch (error) {
           // console.log(error)
            toast.error(error.response.data.message)
        }finally{
            setLoading(false)
        }

    }

    return (

        <div className="flex justify-center items-center min-h-screen bg-green-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-center"> Welcome </CardTitle>
                    <CardDescription className="text-center">
                        Enter given detils for Login
                    </CardDescription>
                  
                </CardHeader>
                <CardContent>

                    <div className="flex flex-col gap-6">
                        
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
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer bg-green-700 hover:bg-green-500" onClick={handleSubmit}>
                       {loading ?<><Loader2 className="h-4 w-4 animate-spin" /> Loading </> : "Log In"} 
                    </Button>
                   
                </CardFooter>
            </Card>
        </div>
    )

}


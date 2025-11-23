import { Button } from "@/components/ui/button"
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
import { Contact, Pencil, TurkishLira } from 'lucide-react';
import { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { useParams } from "react-router-dom";
import { toast } from "sonner"
import profileLogo from '../assets/profileLogo.jpg'
import { setUser } from "@/redux/userSlice";
import axios from "axios";


export default function Profile() {

    const [editable, setEditable] = useState(true)
    const { user } = useSelector(store => store.user)
    const [updateUser, setUpdateUser] = useState({

        firstName: user?.firstName,
        lastName: user?.lastName,

        address: user?.address,
        city: user?.city,
        zipcode: user?.zipcode,

        phoneNo: user?.phoneNo,
        profilePic: user?.profilePic,
        role: user.role,
        email: user?.email,

    })


    const params = useParams()
    const userId = params.userId
    const [file, setFile] = useState(null)
    const dispatch = useDispatch()


    const editHandelaer = () => {
        setEditable((prev) => !prev)
        console.log(user)
    }

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })   // preview only
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const accessToken = localStorage.getItem("accessToken")
        try {

            const formData = new FormData()

            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("zipcode", updateUser.zipcode)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file)
            }

            console.log(userId)
            const res = await axios.put(`http://localhost:5000/api/v1/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-type": "multipart/form-data"
                }
            })

            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }


        } catch (error) {

            console.log(error)
            toast.error("failed to update profile")
        }

    }

    return (

        <>
            <div className="pt-20 min-h-screen bg-gray-100 flex justify-center   ">



                <div className=" w-2xl mx-auto">
                    <Card className=" ">
                        <CardHeader className="flex justify-between">
                            <CardTitle>Do you want edit your account ?</CardTitle>
                            <Button className="cursor-pointer" onClick={editHandelaer}>
                                Edit
                                <Pencil />
                            </Button>

                        </CardHeader>
                        <CardContent>
                            <div className="lg:grid lg:grid-cols-3 flex flex-col gap-4  ">
                                <div className=" w-32">
                                    <img src={updateUser?.profilePic || profileLogo} alt="" className="full h-32 rounded-full object-cover border-4" />
                                    <Label className="mt-4 cursor-pointer bg-green-400 text-center flex justify-center text-gray-800  py-2  hover:bg-green-600 rounded"> Change Picture

                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </Label>

                                </div>
                                <form className="col-span-2">
                                    <div className="flex flex-col gap-6 ">

                                        <div className="grid grid-cols-2 gap-2 ">

                                            <div className="">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    type="text"
                                                    placeholder="Enter first Name"
                                                    required
                                                    className='mt-2'
                                                    disabled={editable}
                                                    name="firstName"
                                                    value={updateUser.firstName}
                                                    onChange={handleChange}

                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    type="lastName"
                                                    placeholder="Enter Last Name"
                                                    required
                                                    className='mt-2'
                                                    disabled={editable}
                                                    name="lastName"
                                                    value={updateUser.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="Email">Email</Label>

                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                name="email"
                                                disabled={editable}
                                                value={updateUser.email}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="phone">Phone</Label>

                                            </div>
                                            <Input
                                                id="phoneNo"
                                                type="text"
                                                required
                                                name="phoneNo"
                                                disabled={editable}
                                                placeholder="Not Aviable , Please Update"
                                                value={updateUser.phoneNo}
                                                onChange={handleChange}


                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="address">Address</Label>

                                            </div>
                                            <Input
                                                id="address"
                                                type="text"
                                                required
                                                name="address"
                                                disabled={editable}
                                                placeholder="Not Aviable , Please Update"
                                                value={updateUser.address}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 ">

                                            <div className="">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    type="text"
                                                    placeholder="Enter City"
                                                    required
                                                    className='mt-2'
                                                    disabled={editable}
                                                    name="city"

                                                    value={updateUser.city}
                                                    onChange={handleChange}

                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="zipcode">Zipcode</Label>
                                                <Input
                                                    id="zipcode"
                                                    type="text"
                                                    placeholder="Enter Your zipcode"
                                                    required
                                                    className='mt-2'
                                                    disabled={editable}
                                                    name="zipcode"
                                                    value={updateUser.zipcode}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </form>


                            </div>

                        </CardContent>
                        <CardFooter className="flex-col ">
                            {!editable &&
                                <Button type="submit" className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" onClick={handleSubmit}>
                                    save
                                </Button>
                            }

                        </CardFooter>
                    </Card>
                </div>

            </div>


        </>

    )
}

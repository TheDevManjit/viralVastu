import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, ArrowLeft, Camera, Save, X, User as UserIcon, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner"
import profileLogo from '../assets/profileLogo.jpg'
import { setUser } from "@/redux/userSlice";
import axios from "axios"
import API_BASE_URL from "@/api/baseUrl";

export default function Profile() {

    const [editable, setEditable] = useState(true)
    const { user } = useSelector(store => store.user)
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        address: user?.address || "",
        city: user?.city || "",
        zipcode: user?.zipcode || "",
        role: user?.role || "user",
        phoneNo: user?.phoneNo || "",
        profilePic: user?.profilePic || "",
        email: user?.email || "",
    })

    const params = useParams()
    const userId = params.userId
    const [file, setFile] = useState(null)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const toggleEdit = () => {
        setEditable((prev) => !prev)
    }

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
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

            const res = await axios.put(`${API_BASE_URL}/api/v1/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-type": "multipart/form-data"
                }
            })

            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
                setEditable(true) // Exit edit mode on success
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar Placeholder or simplified Nav */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium hidden sm:inline">Back to Home</span>
                        </Link>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            My Profile
                        </h1>
                        <div className="w-20"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="md:w-1/3 flex-shrink-0">
                        <Card className="border-none shadow-lg overflow-hidden sticky top-24">
                            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                                {!editable && (
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white text-xs">
                                        Editing Mode
                                    </div>
                                )}
                            </div>
                            <div className="px-6 pb-6 relative">
                                <div className="relative -mt-16 mb-4 flex justify-center">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                            <img
                                                src={updateUser?.profilePic || profileLogo}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {!editable && (
                                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="text-center space-y-1">
                                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                        {updateUser.firstName} {updateUser.lastName}
                                    </h2>
                                    <p className="text-sm text-gray-500">{updateUser.email}</p>
                                    <div className="pt-4 flex justify-center">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                                            {updateUser.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">City</p>
                                        <p className="font-medium text-gray-700 capitalize">{updateUser.city || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">Zipcode</p>
                                        <p className="font-medium text-gray-700">{updateUser.zipcode || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Details Form */}
                    <div className="md:w-2/3 flex-grow">
                        <Card className="border-none shadow-lg">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                    <p className="text-sm text-gray-500">Manage your personal details</p>
                                </div>
                                <Button
                                    onClick={toggleEdit}
                                    variant={editable ? "default" : "secondary"}
                                    size="sm"
                                    className="gap-2"
                                >
                                    {editable ? (
                                        <>
                                            <Pencil className="w-4 h-4" /> Edit Profile
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4" /> Cancel
                                        </>
                                    )}
                                </Button>
                            </div>

                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-gray-600 flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" /> First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                disabled={editable}
                                                className="focus-visible:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-gray-600 flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" /> Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                disabled={editable}
                                                className="focus-visible:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-600 flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={updateUser.email}
                                                onChange={handleChange}
                                                disabled={editable}
                                                className="focus-visible:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNo" className="text-gray-600 flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> Phone Number
                                            </Label>
                                            <Input
                                                id="phoneNo"
                                                name="phoneNo"
                                                value={updateUser.phoneNo}
                                                onChange={handleChange}
                                                disabled={editable}
                                                placeholder="Add phone number"
                                                className="focus-visible:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-gray-600 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Address
                                        </Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={updateUser.address}
                                            onChange={handleChange}
                                            disabled={editable}
                                            placeholder="Enter your street address"
                                            className="focus-visible:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-gray-600 flex items-center gap-2">
                                                <Building2 className="w-4 h-4" /> City
                                            </Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                disabled={editable}
                                                className="focus-visible:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipcode" className="text-gray-600 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Zipcode
                                            </Label>
                                            <Input
                                                id="zipcode"
                                                name="zipcode"
                                                value={updateUser.zipcode}
                                                onChange={handleChange}
                                                disabled={editable}
                                                className="focus-visible:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {!editable && (
                                        <div className="pt-4 flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                                            >
                                                {loading ? "Saving..." : (
                                                    <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

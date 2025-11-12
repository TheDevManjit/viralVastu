import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams ,Link} from "react-router-dom";

const EmailVarificationPage = () => {

    const { token } = useParams()
    const [status, setStatus] = useState("varifying.......")
    const navigate = useNavigate()

    console.log(token)
    async function varifyEmail() {

        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/varify", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.data.success) {
                setStatus("✅ Email Varified Successfully")
                setTimeout(() => {
                    navigate("/login")
                }, 4000)
            }
        } catch (error) {
            console.log(error)
            setStatus("❌Varification failed PLease try again")
        }
    }

    useEffect(() => {
        varifyEmail()
    }, [token])

    return (
        <div className="relative w-full h-[750px] bg-green-100 overflow-hidden">
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 ">{status}</h2>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg shadow-md transition"
                        >
                            <Link to={'/login'} /> Go to Log in page
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )

}


export default EmailVarificationPage
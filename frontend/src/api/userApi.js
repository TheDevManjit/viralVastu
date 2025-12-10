import { Password } from "@mui/icons-material"
import axios from "axios"


const baseUrl = "http://localhost:5000/api/v1/user/"

const logIn = async (formData) => {

    try {
        const response = await axios.post(`${baseUrl}/login`, formData, 

        )
        return response

    } catch (error) {
        console.error("Error fetching product:", error);
        throw error.response?.data || error;
    }


}

const forgotpassword = async (email) => {
    try {
        const response = await axios.post(`${baseUrl}/forgotpassword`, { email })
        return response
    } catch (error) {
        return error.response
    }
}



export { logIn, forgotpassword }
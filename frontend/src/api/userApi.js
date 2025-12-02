import axios from "axios"


const baseUrl = "http://localhost:5000/api/v1/user/"

const forgotpassword = async(email) =>{
    try {
        const response = await axios.post(`${baseUrl}/forgotpassword`,{email})
        return response
    } catch (error) {
        return error.response
    }
}

export {forgotpassword}
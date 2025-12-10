import axios from "axios"
import API_BASE_URL from "./baseUrl"

const getAllProducts = async () => {

    try {

    const res = await axios.get(`${API_BASE_URL}/api/v1/product/allProducts`)
        if (res.data.success) {
            // console.log(res.data.products)
            return res.data.products
        }

        return res.data.message

    } catch (error) {
        return error
    }


}

const getProductById = async (id) => {

    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/product/product/${id}`);
        return response.data
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error.response?.data || error;
    }

}

export { getAllProducts,getProductById }
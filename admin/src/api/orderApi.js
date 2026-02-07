import axios from "axios";

// Using hardcoded URL as done in other files
const baseUrl = 'http://localhost:5000/api/v1/order';

const getAllOrders = async () => {
    try {
        const res = await axios.get(`${baseUrl}/admin/all-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return res;
    } catch (error) {
        throw error.response;
    }
};

const updateOrderStatus = async (id, status) => {
    try {
        const res = await axios.put(`${baseUrl}/admin/update-status/${id}`, { status }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json"
            },
        });
        return res;
    } catch (error) {
        throw error.response;
    }
};

export { getAllOrders, updateOrderStatus };

import axios from "axios";

// Assuming same base URL pattern as productApi, but usually it should be centralized. 
// Using hardcoded for consistency with existing productApi.js
const baseUrl = 'http://localhost:5000/api/v1/user';

const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseUrl}/allusers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return res;
    } catch (error) {
        throw error.response;
    }
};

const updateUser = async (id, userData) => {
    try {
        const res = await axios.put(`${baseUrl}/update/${id}`, userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json" // Ensure correct content type
            },
        });
        return res;
    } catch (error) {
        throw error.response;
    }
};

const deleteUser = async (id) => {
    try {
        const res = await axios.delete(`${baseUrl}/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        return res;
    } catch (error) {
        throw error.response;
    }
};

export { getAllUsers, updateUser, deleteUser };

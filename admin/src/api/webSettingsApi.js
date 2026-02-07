import axios from "axios";

// Using hardcoded URL as done in other files
const baseUrl = 'http://localhost:5000/api/v1/websettings';

const getWebSettings = async () => {
    try {
        const res = await axios.get(`${baseUrl}/get`);
        return res;
    } catch (error) {
        throw error.response;
    }
};

const updateWebSettings = async (formData) => {
    try {
        const res = await axios.put(`${baseUrl}/update`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "multipart/form-data"
            },
        });
        return res;
    } catch (error) {
        throw error.response;
    }
};

export { getWebSettings, updateWebSettings };

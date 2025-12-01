import axios from "axios"
import { TentIcon } from "lucide-react";
import { data } from "react-router-dom";



const baseUrl = 'http://localhost:5000/api/v1/product'

const getAllProducts = async () => {
  try {
    const res = await axios.get(`${baseUrl}/allProducts`);
    // ✅ Return only the actual backend response body
    return res;
  } catch (error) {
    
      throw error.response
   
  }
};


const getProductById = async (id) => {

  try {
    const res = await axios.get(`${baseUrl}/product/${id}`)

    if (res.data.success) {
      // console.log(res.data.product)
      return res
    }

    return res.data.message

  } catch (error) {
    throw error.response
  }


}

const addProduct = async (productData) => {

  console.log("📦 API received productData:", productData);

  for (let [key, val] of productData.entries()) {
    console.log(key, val);
  }
  
  try {
    const res = await axios.post(`${baseUrl}/add`, productData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

      },
    })
    return res
  } catch (error) {
    throw error.response?.data || { message: error.message || "Unknown error" };
  }

}


const updateProduct = async (id, productData) => {
  try {
    const res = await axios.put(
      `${baseUrl}/update/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          // ❌ DO NOT set multipart/form-data manually
        },
      }
    );

    if (res.data.success) {
      return res;
    } else {
      return res.data.message;
    }

  } catch (error) {
    throw error.response
  };

}




const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    return res;       // only return actual data
  } catch (error) {
    throw error.response;  // forward backend error to component
  }
};



export { getAllProducts, getProductById, updateProduct, addProduct, deleteProduct };
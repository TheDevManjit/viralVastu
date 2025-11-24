import axios from "axios"



const baseUrl = 'http://localhost:5000/api/v1/product'

const getAllProducts = async () => {

    try {

        const res = await axios.get(`http://localhost:5000/api/v1/product/allProducts`)
        if (res.data.success) {
           // console.log(res.data.products)
          return res.data.products

        }

        return res.data.message

    } catch (error) {
       return error
    }


} 


export {getAllProducts}
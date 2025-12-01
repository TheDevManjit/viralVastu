import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',           // action type
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/cart/get-cart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            console.log("Fetch Cart Response:", response.data)
            return response.data   // this becomes "action.payload" in reducers
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/cart/add-to-cart',
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            )
            console.log("Add to Cart Response:", response.data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const cartSlice = createSlice({

    name: "cart",
    initialState: {
        cart: [],
        loading: false,
        error: null,
    },

    reducers: {

    }
    ,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload.cart || []
              
            })

            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Something went wrong'
            })


            // Handle addToCart actions
            .addCase(addToCart.fulfilled, (state, action) => {
                if (action.payload?.cart) {
                    state.cart = action.payload.cart
                   
                }
            })

            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})



export default cartSlice.reducer
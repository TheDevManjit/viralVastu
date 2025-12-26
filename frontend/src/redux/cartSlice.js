import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import API_BASE_URL from '@/api/baseUrl'

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',           // action type
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/cart/get-cart`, {
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
            const response = await axios.post(`${API_BASE_URL}/api/v1/cart/add-to-cart`,
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

export const removeItem = createAsyncThunk(
    'cart/removeCart',
    async ({ productId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/cart/remove`,
                { productId },
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

// http://localhost:5000/api/v1/cart/clear-cart

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_,{ rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/cart/clear-cart`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            )
            console.log("Cart is Clear", response.data)
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

            // Handle remove
            .addCase(removeItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart; // ✅ update the store
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item";
            })

            // handle clearcart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = []; // ✅ update the store
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item";
            });
    },
})



export default cartSlice.reducer
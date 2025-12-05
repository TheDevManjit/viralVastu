import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to add a category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ label, value }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/category/add",
        { label, value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );


      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add category"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "category/fetchCategory",
  async (_,{ rejectWithValue }) => {

    try {
      const response = await axios(
        "http://localhost:5000/api/v1/category/get-all-category",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      )

      return response.data;
    } catch (error) {
       return rejectWithValue(
        error.response?.data || "Failed to add category"
      );
    }

  }
)

// Slice definition
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.categories.push(action.payload.data);
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
       .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
          if (action.payload?.data) {
            state.categories = action.payload.data;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default categorySlice.reducer;

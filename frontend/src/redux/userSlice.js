import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'User',
    initialState: {
        user: (() => {
            try {
                const item = localStorage.getItem("user");
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error("Failed to restore user from localStorage", error);
                return null;
            }
        })()
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
        }
    }
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer
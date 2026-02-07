import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'User',
    initialState: {
        user: null,
        users: [] // List of all users for admin
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        }
    }
})

export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer
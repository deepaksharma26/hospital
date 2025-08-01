import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMethod } from "../../api";
import { createSlice } from "@reduxjs/toolkit";

// Async thunk for fetching user roles
export const fetchUserRoles = createAsyncThunk('userRole/fetchUserRoles', async () => {
    const response = await getMethod('userRole');
    return response;
});
const userRoleSlice = createSlice({
  name: 'userRole',
  initialState: {
    roles: [],
    loading: false,
    error: null,        
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserRoles.fulfilled, (state, action) => { 
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchUserRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default userRoleSlice.reducer; // Selector to access
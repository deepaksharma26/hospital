import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const changePassword = createAsyncThunk(
    "changePassword/changePassword",    
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/change-password', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
const changePasswordSlice = createSlice({
    name: "changePassword",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export default changePasswordSlice.reducer;

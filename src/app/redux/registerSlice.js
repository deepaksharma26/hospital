import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postMethod } from '../../api'; 
// Async thunk for user registration
export const registerUser = createAsyncThunk('users/register', async (userData) => {
  const response = await postMethod('auth/register', userData);
  return response;
}); 
const registerSlice = createSlice({
  name: 'register',
  initialState: {
    data: null,
    loading: false, 
    error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
}); 
export default registerSlice.reducer; 
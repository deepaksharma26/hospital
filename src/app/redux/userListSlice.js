import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMethod } from "../../api"; 
import { createSlice } from "@reduxjs/toolkit";

// Async thunk for fetching users
export const fetchUsersList = createAsyncThunk('users/fetchUsersList', async (data) => {
  const response = await getMethod('auth/users', data);
  return response;
}); 
const userListSlice = createSlice({
  name: 'usersList',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => { 
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default userListSlice.reducer;
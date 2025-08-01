import { createAsyncThunk } from "@reduxjs/toolkit";    
import { createSlice } from "@reduxjs/toolkit";
import { getMethod, postMethod, putMethod } from "../../api";
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userId, userData) => {
    console.log('Data to be updated:', userData, userId);
    
      const response = await putMethod(`auth/update-user/${userId}`, userData);
      return response.data;
    
  }
);
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getMethod(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);  
export const fetchUsersList = createAsyncThunk(
  "user/fetchUsersList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getMethod("/api/v1/users", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await postMethod("/api/v1/users", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);  
export const toggleUserStatus = createAsyncThunk(
  "user/toggleUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await putMethod(`/api/v1/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const updateUserSlice = createSlice({
  name: "updateUser",
  initialState: {
    user: null,
    loading: false,         
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});
export default updateUserSlice.reducer;


import { createAsyncThunk } from "@reduxjs/toolkit";    
import { createSlice } from "@reduxjs/toolkit";
import { getMethod, postMethod, putMethod } from "../../api";
import { routesName } from "../constants/routesName";
import { apiRoutes } from "../constants/apiRoutes";
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData) => {
    console.log('Data to be updated:', userData);
    
      const response = await putMethod(`auth/update-user/${userData.id}`, userData);
      return response.data;
    
  }
);
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getMethod(`users/${userId}`);
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
      const response = await getMethod("users", { params });
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
      const response = await postMethod(apiRoutes.REGISTER, userData);
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


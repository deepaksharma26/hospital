import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import { postMethod } from '../../api';
import { setAccessToken } from '../../utills/session';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (data) => {
  const response = await postMethod('auth/login', data);
  return response;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        setAccessToken(action.payload?.token); // Assuming the token is returned in the payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
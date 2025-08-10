import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import { apiRoutes } from '../constants/apiRoutes';
import { getMethod } from '../../api';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
    async (data, { getState, dispatch }) => {
    const response = await getMethod(apiRoutes.DASHBOARD_DATA, data);
    return response;
  }
);

const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardData: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
 
export default DashboardSlice.reducer;
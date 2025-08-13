import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch sales report with filters
export const fetchSalesReport = createAsyncThunk(
  'report/fetchSalesReport',
  async (filters, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint and params
      const response = await axios.get('/api/report/sales', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  salesReport: {
    totalSales: 0,
    totalTax: 0,
    totalDiscount: 0,
    paymentMethods: {},
    taxCollection: {},
    details: [],
  },
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch sales report';
      });
  },
});

export default reportSlice.reducer;
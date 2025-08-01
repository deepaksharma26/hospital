import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMethod } from "../../api"; 
import { createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../constants/apiRoutes";

// Async thunk for fetching users
export const fetchBillingCategories = createAsyncThunk('billingCategory/fetchBillingCategories', async (data) => {
  const response = await getMethod(apiRoutes.BILLING_CATEGORY); 
  return response;
}); 
const BillingCategorySlice = createSlice({
  name: 'billingCategory',
  initialState: {
    billingCategory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingCategories.fulfilled, (state, action) => {  
        state.loading = false;
        state.billingCategory = action.payload;
      })
      .addCase(fetchBillingCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default BillingCategorySlice.reducer;
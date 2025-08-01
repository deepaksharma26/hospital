import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMethod } from "../../api"; 
import { createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../constants/apiRoutes";

// Async thunk for fetching users
export const fetchPaymentType = createAsyncThunk('users/fetchUsersList', async (data) => {
  const response = await getMethod(apiRoutes.PAYMENT_TYPE, data);
  return response;
}); 
const PaymentTypeSlice = createSlice({
  name: 'usersList',
  initialState: {
    paymentType: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentType.fulfilled, (state, action) => { 
        state.loading = false;
        state.paymentType = action.payload;
      })
      .addCase(fetchPaymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default PaymentTypeSlice.reducer;
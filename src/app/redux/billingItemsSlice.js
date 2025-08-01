import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMethod, postMethod } from "../../api"; 
import { createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../constants/apiRoutes";

// Async thunk for fetching users
export const fetchBillingItems = createAsyncThunk('billingItems/fetchBillingItems', async (data) => {
  const response = await getMethod(apiRoutes.BILLING_ITEM);
  return response;
}); 
export const addBillingItem = createAsyncThunk( 
  'billingItems/addOrUpdateBillingItem',
  async (billingItemData) => {
    const response = await postMethod(apiRoutes.BILLING_ITEM, billingItemData);
    return response // Assuming the API returns the created/updated item
  }
);
export const updateBillingItem = createAsyncThunk(
  'billingItems/updateBillingItem',
  async (billingItemData) => {
    const response = await postMethod(`${apiRoutes.BILLING_ITEM}/${billingItemData.id}`, billingItemData);
    return response // Assuming the API returns the updated item
  }
);
export const deleteBillingItem = createAsyncThunk(
  'billingItems/deleteBillingItem',   
  async (billingItemId) => {
    const response = await postMethod(`${apiRoutes.BILLING_ITEM}/${billingItemId}`);
    return response // Assuming the API returns a success message or the deleted item
  }
);
const BillingItemsSlice = createSlice({
  name: 'billingItems',
  initialState: {
    billingItems: [],
    addBillingItems: null,
    updateBillingItems: null,
    deleteBillingItems: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBillingItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBillingItem.fulfilled, (state, action) => { 
        state.loading = false;
        state.addBillingItems = action.payload;
      })
      .addCase(addBillingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBillingItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillingItem.fulfilled, (state, action) => { 
        state.loading = false;
        state.updateBillingItems = action.payload;
      })
      .addCase(updateBillingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBillingItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBillingItem.fulfilled, (state, action) => { 
        state.loading = false;
        state.deleteBillingItems = action.payload;
      })
      .addCase(deleteBillingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBillingItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingItems.fulfilled, (state, action) => { 
        state.loading = false;
        state.billingItems = action.payload;
      })
      .addCase(fetchBillingItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default BillingItemsSlice.reducer;
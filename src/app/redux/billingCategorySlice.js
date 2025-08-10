import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMethod, putMethod, postMethod, deleteMethod } from "../../api"; 
import { createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../constants/apiRoutes";

// Async thunk for fetching users
export const fetchBillingCategories = createAsyncThunk('billingCategory/fetchBillingCategories', async (data) => {
  const response = await getMethod(apiRoutes.BILLING_CATEGORY); 
  return response;
}); 
// Async thunk for creating a new billing category
export const createBillingCategory = createAsyncThunk('billingCategory/createBillingCategory', async (data) => {
  const response = await postMethod(apiRoutes.BILLING_CATEGORY, data);
  return response;
});
// Async thunk for updating an existing billing category
export const updateBillingCategory = createAsyncThunk('billingCategory/updateBillingCategory', async (data) => {
  const response = await putMethod(`${apiRoutes.BILLING_CATEGORY_UPDATE}/${data.id}`, data);
  return response;
});
export const activeInactive = createAsyncThunk('billingCategory/activeInactive', async (data) => {
  const response = await putMethod(`${apiRoutes.BILLING_CATEGORY_UPDATE}/${data.id}`, data);
  return response;
});
// Async thunk for deleting a billing category
export const deleteBillingCategory = createAsyncThunk('billingCategory/deleteBillingCategory', async (id) => {
  const response = await deleteMethod(`${apiRoutes.BILLING_CATEGORY_DELETE}/${id}`,{ deleted: true });
  return response;
});

const BillingCategorySlice = createSlice({
  name: 'billingCategory',
  initialState: {
    billingCategory: [],
    updateBillingCategory: null,
    createBillingCategory: null,
    deleteBillingCategory: null,
    activeInactive: null,
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
      })
      .addCase(createBillingCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBillingCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.createBillingCategory = action.payload;
      })
      .addCase(createBillingCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBillingCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillingCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.billingCategory = action.payload;
      })
      .addCase(updateBillingCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBillingCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBillingCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteBillingCategory = action.payload;
      })
      .addCase(deleteBillingCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(activeInactive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activeInactive.fulfilled, (state, action) => {
        state.loading = false;
        state.activeInactive = action.payload;
      })
      .addCase(activeInactive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
       
  },
});
export default BillingCategorySlice.reducer;
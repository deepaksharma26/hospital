import { createAsyncThunk } from "@reduxjs/toolkit"; 
import { createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../constants/apiRoutes";
import { getMethod, postMethod, putMethod } from "../../api";
// Async thunk for fetching billing items
export const fetchBillingList = createAsyncThunk('billing/fetchBilling', async ()=> {
  const response = await getMethod(apiRoutes.BILLING_ITEM);
  return response;
});
export const addBilling = createAsyncThunk(
  'billingItems/addOrUpdateBilling',
  async (billingItemData) => {
    const response = await postMethod(apiRoutes.BILLING_ITEM, billingItemData);
    return response; // Assuming the API returns the created/updated item
  }
);
export const updateBilling = createAsyncThunk(
  'billingItems/updateBilling',
    async (billingItemData) => {    
    const response = await putMethod(`${apiRoutes.BILLING_ITEM}/${billingItemData.id}`, billingItemData);
    return response; // Assuming the API returns the updated item
  }
);
export const deleteBilling = createAsyncThunk(      
    'billing/deleteBilling',
    async (billingItemId) => {
        const response = await postMethod(`${apiRoutes.BILLING_ITEM}/${billingItemId}`);
        return response; // Assuming the API returns a success message or the deleted item
    }
    );  
const BillingSlice = createSlice({
  name: 'billing',
  initialState: {
    billings: [],
    addBillings: null,      
    updateBillings: null,
    deleteBillings: null,
    loading: false,
    error: null,
  },
  reducers: {},     
    extraReducers: (builder) => {
        builder
        .addCase(addBilling.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addBilling.fulfilled, (state, action) => {
            state.loading = false;
            state.addBillings = action.payload;
        })
        .addCase(addBilling.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateBilling.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateBilling.fulfilled, (state, action) => {
            state.loading = false;
            state.updateBillings = action.payload;
        })
        .addCase(updateBilling.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(deleteBilling.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteBilling.fulfilled, (state, action) => {
            state.loading = false;
            state.deleteBillings = action.payload;
        })
        .addCase(deleteBilling.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchBillingList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchBillingList.fulfilled, (state, action) => {
            state.loading = false;
            state.billings = action.payload;
        })
        .addCase(fetchBillingList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
    }
);
export default BillingSlice.reducer;
import { createAsyncThunk } from "@reduxjs/toolkit"; 
import { createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../constants/apiRoutes";
import { getMethod, postMethod, putMethod } from "../../api";
// Async thunk for fetching billing items
export const fetchBillingList = createAsyncThunk('billing/fetchBilling', async ()=> {
  const response = await getMethod(apiRoutes.BILLING);
  return response;
});
export const fetchBillingById = createAsyncThunk('billing/fetchBillingById', async (billingId)=> {
  const response = await getMethod(apiRoutes.BILLING+`/${billingId}`);
  return response;
});

export const addBilling = createAsyncThunk(
  'billing',
  async (billingData) => {
    const response = await postMethod(apiRoutes.BILLING, billingData);
    return response; // Assuming the API returns the created/updated item
  }
);
export const updateBilling = createAsyncThunk(
  'billing/updateBilling',
  async (data) => {
    console.log('billingItemData', data);
    const response = await putMethod(`${apiRoutes.BILLING}/${data?.id}`, data);
    return response; // Assuming the API returns the updated item
  }
);
export const deleteBilling = createAsyncThunk(      
    'billing/deleteBilling',
    async (billingItemId) => {
        const response = await putMethod(`${apiRoutes.BILLING}/${billingItemId}`);
        return response; // Assuming the API returns a success message or the deleted item
    }
);  
const BillingSlice = createSlice({
  name: 'billing',
  initialState: {
    billingData: null,
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
        })
         .addCase(fetchBillingById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchBillingById.fulfilled, (state, action) => {
            state.loading = false;
            state.billingData = action.payload;
        })    
        .addCase(fetchBillingById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
    }
);
export default BillingSlice.reducer;
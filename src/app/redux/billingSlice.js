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
export const fetchBillingByUserId = createAsyncThunk('billing/fetchBillingByUserId', async (billingId)=> {
  const response = await getMethod(apiRoutes.BILLING_BY_USER+`/${billingId}`);
  return response;
});
//fetch billing by date range
export const fetchBillingByDateRange = createAsyncThunk('billing/fetchBillingByDateRange', async (startDate) => {
  const response = await getMethod(`${apiRoutes.BILLING_DATE_RANGE}?startDate=${startDate}&endDate=${new Date().toISOString()}`);
  return response;
});
//fetch billing by financial year
export const fetchBillingByFinancialYear = createAsyncThunk('billing/fetchBillingByFinancialYear', async (financialYear) => {
  const response = await getMethod(`${apiRoutes.BILLING}?financialYear=${financialYear}`);
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
export const fetchUserDetailsByBill = createAsyncThunk(
  'billing/fetchUserDetailsByBill',
  async (billingId) => {
    const response = await getMethod(`${apiRoutes.CUSTOMER_DETAILS}/${billingId}`);
    return response; // Assuming the API returns the user details associated with the billing
  }
);
const BillingSlice = createSlice({
  name: 'billing',
  initialState: {
    billingData: null,
    customerDetails: null,
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
        })
          .addCase(fetchUserDetailsByBill.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserDetailsByBill.fulfilled, (state, action) => {
            state.loading = false;
            state.customerDetails = action.payload;
        })
        .addCase(fetchUserDetailsByBill.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
    }
);
export default BillingSlice.reducer;
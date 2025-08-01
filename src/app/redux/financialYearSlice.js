import { createAsyncThunk } from "@reduxjs/toolkit"; 
import { createSlice } from "@reduxjs/toolkit";
import { getMethod, postMethod } from "../../api";
import { apiRoutes } from "../constants/apiRoutes"; 
export const fetchFinancialYear = createAsyncThunk(
  'financialYear/fetchFinacialYear',
  async () => {
    const response = await getMethod(apiRoutes.FINANCIAL_YEAR);
    return response
  }
);
export const addOrUpdateFinancialYear = createAsyncThunk(
  'financialYear/addOrUpdateFinancialYear',
  async (financialYearData) => {
    const response = await postMethod(apiRoutes.FINANCIAL_YEAR, financialYearData);
    return response
    // For now, just return the data for demonstration purposes
    return financialYearData;
  }
);
const initialState = {
  financialYears: [],
  addFinancialYear: null,
  updateFinancialYear: null,
  deleteUser: null,
  loading: false,
  error: null,
};  
const financialYearsSlice = createSlice({
  name: 'financialYear',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(addOrUpdateFinancialYear.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addOrUpdateFinancialYear.fulfilled, (state, action) => {
            state.loading = false; 
            state.addFinancialYear = action.payload;
        })
        .addCase(addOrUpdateFinancialYear.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }) 
      .addCase(fetchFinancialYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialYear.fulfilled, (state, action) => { 
        state.loading = false;
        state.financialYears = action.payload;
      })
      .addCase(fetchFinancialYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default financialYearsSlice.reducer;
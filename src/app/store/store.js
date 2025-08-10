import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import registerReducer from '../redux/registerSlice'; // Assuming you have a registerSlice
import changePassword  from '../redux/changePasswordSlice'; // Adjust the import path as necessary
import userListReducer from '../redux/userListSlice'; // Assuming you have a userListSlice
import userRoleReducer from '../redux/userRoleSlice'; // Assuming you have a userRoleSlice
import updateUserReducer  from '../redux/updateUserSlice';
import billingCategorySlice from '../redux/billingCategorySlice';
import financialYearsSlice from '../redux/financialYearSlice'; // Assuming you have a financialYear reducer
import paymentTypeSlice from '../redux/paymentTypeSlice';
import billingItemSlice from '../redux/billingItemsSlice'; 
import billingSlice from '../redux/billingSlice'; // Assuming you have a billingSlice
import dashboardSlice from '../redux/dashboardSlice'; // Assuming you have a dashboardSlice
const store = configureStore({
  reducer: {
    users: userReducer,
    changePassword: changePassword, // Assuming you have a changePassword reducer
    register: registerReducer, // Assuming you have a registerReducer imported
    userList: userListReducer, // Assuming you have a userListReducer importedx
    userRole: userRoleReducer, // Assuming you have a userRoleReducer imported
    updateUser: updateUserReducer, // Assuming you have an updateUserReducer imported
    billingCategory: billingCategorySlice,
    financialYear: financialYearsSlice,
    paymentType: paymentTypeSlice, // Assuming you have a paymentTypeSlice imported
    billingItems: billingItemSlice, // Assuming you have a billingItemsSlice imported
    billing: billingSlice, // Assuming you have a billingSlice imported
    dashboard: dashboardSlice, // Assuming you have a dashboardSlice imported
  },
});

export default store;
import React from 'react';
import { routesName } from '../app/constants/routesName';


// import { Dashboard } from '../app/dashboard/index.js';
const Home = React.lazy(() => import('../app/home/index')); // Lazy load the login component
const Login = React.lazy(() => import('../app/auth/login/index')); // Lazy load the login component
const Register = React.lazy(() => import('../app/auth/register/index')); // Lazy load the register component
const NotFound = React.lazy(() => import('../components/NotFound')); //
const ChangePassword = React.lazy(() => import('../app/auth/changePassword/index')); // Lazy load the change password component
const Dashboard = React.lazy(() => import('../app/dashboard/index')); // Lazy load the dashboard component
const ListAllUsers = React.lazy(() => import('../app/user/index')); // Lazy load the list all users component
const AddUser = React.lazy(() => import('../app/user/addUser')); // Lazy load the add user component
const ModifyUser = React.lazy(() => import('../app/user/modifyUser')); // Lazy load the modify user component 
const Billing = React.lazy(() => import('../app/billing/index')); // Lazy load the billing component
const FinancialYear = React.lazy(() => import('../app/financialYear/FinancialYear')); // Lazy load the financial year component
const BillingItem = React.lazy(() => import('../app/billing/billingItem')); // Lazy load the billing item component
const BillingList = React.lazy(() => import('../app/billing/listAllBilling')); // Lazy load the billing list component
const BillingEdit = React.lazy(() => import('../app/billing/editBilling')); // Lazy load the billing edit component
const routesConfig = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: routesName.LOGIN,
    element: <Login />,
  }, 
  {
    path: routesName.REGISTER,
    element: <Register />,
  },
  {
    path: routesName.CHANGE_PASSWORD,
    element: <ChangePassword />, // Assuming you have a change password component
  },
  {
    path: '/', 
    children:[
        {
           path: routesName.DASHBOARD,
           element: <Dashboard element={<Home/>}/>,
            // element: <h1>Dashboard Home</h1>, // Placeholder for dashboard home
        },
        {
           path: routesName.LIST_ALL_USERS,
           element: <Dashboard element={<ListAllUsers/>}/>,
            // element: <h1>Dashboard Home</h1>, // Placeholder for dashboard home
        },
        //add new user
        {
          path: routesName.ADD_USER,
          element: <Dashboard element={<AddUser/>}/>, // Assuming you have a component for adding a user
        },
        //moqdify user
        { 
          path: routesName.MODIFY_USER + '/:userId',
          element: <Dashboard element={<ModifyUser/>}/>, // Assuming you have a component for modifying a user
        },
        {
          path: routesName.BILLING,
          element: <Dashboard element={<Billing/>}/>, // Assuming you have a component for billing
        },
        {
          path: routesName.FINANCIALYEAR,
          element: <Dashboard element={<FinancialYear/>}/>, // Assuming you have a component for billing
        },
        {
          path: routesName.BILLING_ITEM,
          element: <Dashboard element={<BillingItem/>}/>, // Assuming you have a component for billing
        },
        {
          path: routesName.EDITBILLING+ '/:billingId',
          element: <Dashboard element={<BillingEdit/>}/>, // Assuming you have a component for billing
        },
        {
          path: routesName.LISTBILLIS,
          element: <Dashboard element={<BillingList/>}/>, // Assuming you have a component for billing
        }
    ]
  },

//   {
//     path: '/about',
//     element: <About />,
//   },
//   {
//     path: '/products',
//     element: <Products />,
//     children: [
//       {
//         path: ':id', // Dynamic parameter for product ID
//         element: <ProductDetail />,
//       },
//     ],
//   },
  {
    path: '*', // Catch-all for 404 Not Found
    element: <NotFound />,
  },
];

export default routesConfig;
import { Box, Grid, Typography, Card, Paper, Button } from "@mui/material";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../../utills/session";
import { DataGrid } from '@mui/x-data-grid';
import PieChartIcon from '@mui/icons-material/PieChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../redux/dashboardSlice";
import { routesName } from "../constants/routesName";
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from "react-router-dom";

const pieData = [
  { name: "Consultation", value: 4000 },
  { name: "Surgery", value: 3000 },
  { name: "Medicine", value: 2000 },
  { name: "Other", value: 1500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#533eaeff', '#533eaeff', '#ff8042', '#d32f2f', '#1976d2', '#388e3c', '#f57c00', '#7b1fa2'];
var count = 0;
const Home = ({ element }) => { 
  const [printData, setPrintData] = useState(false);
  const { dashboardData } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isTokenExpired()) { 
      navigate('/');
    }
    dispatch(fetchDashboardData()); 
  }, []);

  const cardData = [
    { 
      title: `Today's Sales - ${dashboardData?.today?.count ?? 0}`, 
      value: `₹${parseFloat(dashboardData?.today?.sum ?? 0).toFixed(2)}`, 
      icon: <MonetizationOnIcon fontSize="large" />, 
      gradient: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)" 
    },
    
    
    // Only spread if todayByPaymentType is an array
    ...(Array.isArray(dashboardData?.todayByPaymentType)
      ? dashboardData.todayByPaymentType.map((item) => ({
          title: item._id,
          value: `₹${parseFloat(item.sum ?? 0).toFixed(2)}`,
          icon: <PaymentIcon fontSize="large" />,
          gradient: `linear-gradient(90deg, ${COLORS[count++]} 0%, #185a9d 100%)`
        }))
      : [])
      ,
      { 
      title: "Month Revenue", 
      value: `₹${parseFloat(dashboardData?.month?.sum ?? 0).toFixed(2)}`, 
      icon: <PieChartIcon fontSize="large" />, 
      gradient: "linear-gradient(90deg, #f953c6 0%, #b91d73 100%)" 
      } 
  ];
 
  const columns = [
      
      { field: 'userId', headerName: 'Customer ID', width: 150,
        renderCell: (params) => (
          <Typography variant="subtitle1" color="textSecondary">
            {params.value || 'N/A'}
          </Typography>
        )},
      { field: 'customerName', headerName: 'Customer Name', width: 150,
        renderCell: (params) => (
          <Typography variant="subtitle1" color="textSecondary">
            {params.value || 'N/A'}
          </Typography>
        )},
      { field: 'customerPhone', headerName: 'Phone', width: 100,
        renderCell: (params) => (
          <Typography variant="subtitle1" color="textSecondary">
            {params.value || 'N/A'}
          </Typography>
        )},
      { field: 'customerAddress', headerName: 'Address', width: 150,
        renderCell: (params) => (
          <Typography variant="subtitle1" color="textSecondary">
            {params.value || 'N/A'}
          </Typography>
        )},
      { field: 'taxAmount', headerName: 'Tax', width: 90,
        renderCell: (params) => (
          <Typography variant="subtitle1" fontWeight={'bold'} color="textSecondary">
            {params.value ? params.value.toFixed(2) : '0.00'}
          </Typography>
        )
      },
      { field: 'discountAmount', headerName: 'Discount', width: 90,
        renderCell: (params) => (
          <Typography variant="subtitle1" fontWeight={'bold'} color="textSecondary">
            {params.value ? params.value.toFixed(2) : '0.00'}
          </Typography>
        )
      },
      // { field: 'billingDate', headerName: 'Billing Date', width: 100,
      //   renderCell: (params) => (
      //     <Typography variant="subtitle1" color="textSecondary">
      //       {new Date(params.value).toLocaleDateString()}
      //     </Typography>
      //   )},
      { field: 'totalAmount', headerName: 'Total Amount',
        renderCell: (params) => (
          <Typography variant="subtitle1" fontWeight={'bold'} color="textSecondary">
            {params.value ? params.value.toFixed(2) : '0.00'}
          </Typography>
        ),
        width: 90 },
      { field: 'finalAmount', headerName: 'Final Amount',
        renderCell: (params) => (
          <Typography variant="subtitle1" fontWeight={'bold'} color="textSecondary">
            {params.value ? params.value.toFixed(2) : '0.00'}
          </Typography>
        ),
        width: 90 },
      { field: 'paymentMethodDetails', headerName: 'Payment Method', width: 150
        , renderCell: (params) => (
          <Typography variant="subtitle1" color="textSecondary">
            {params.value || 'N/A'}
          </Typography>
        ) 
       },
      {
        field: '',
        renderCell: (e) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              label="Modify"
              variant="outlined"
              color="warning"
              size="small"
              onClick={() => window.open(`${routesName.EDITBILLING}/${e.row._id}`, '_blank')}
              sx={{ fontWeight: 600 }}
            >
              Modify
            </Button>
            <Button
              label="Print"
              variant="outlined"
              color='primary'
              size="small"
              sx={{ fontWeight: 600 }}
              onClick={() => handlePrint(e.row)}
            >
              Print
            </Button>
          </Box>
        ),
        headerName: 'Modify', width: 200
      },
    ];
    const handlePrint = (e) => {
      setPrintData(e);
    };
    
    return (
      <Grid container sx={{ width: '100%', m: 0, p: 0, overflow: 'hidden' }}>
        
        <Grid item xs={12}>
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2, md: 3 },
              width: '100%',
              maxWidth: '100vw',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {/* Attractive Heading and Welcome */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                flexDirection: 'column',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    wordBreak: 'break-word',
                  }}
                >
                  Thakur Eye Hospital Billing Dashboard
                </Typography>
              </Box>
              {/* Card Tiles */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  mt: 4,
                  mb: 4,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {cardData.map((card, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      minWidth: 160,
                      maxWidth: 220,
                      color: '#fff',
                      background: card.gradient,
                      boxShadow: 3,
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 2,
                      py: 2,
                      m: 1,
                      flex: '1 1 160px',
                    }}
                  >
                    <Box sx={{ mb: 1 }}>{card.icon}</Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Data Table and Pie Chart Rows */}
            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
              {/* Data Table */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 2, boxShadow: 2, overflow: 'hidden' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Today's Last 10 Billed Report
                  </Typography>
                  <Box sx={{ height: 320, width: '100%', overflow: 'hidden' }}>
                    <DataGrid
                      rows={
                        (dashboardData?.last10 || []).map((row, idx) => ({
                          ...row,
                          id: row.id ?? row._id ?? idx + 1,
                        }))
                      }
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      disableSelectionOnClick
                      hideFooterSelectedRowCount
                      sx={{
                        border: 0,
                        '.MuiDataGrid-virtualScroller': { overflow: 'hidden !important' },
                        '.MuiDataGrid-main': { overflow: 'hidden !important' },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              {/* Pie Chart */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 2, boxShadow: 2, height: '100%', overflow: 'hidden' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Month Report (Revenue by Category)
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

           
          </Box> 
        </Grid>
      </Grid>
    );
  };
  
  export default Home;
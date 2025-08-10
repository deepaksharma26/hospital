import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBillingByDateRange, fetchBillingById, fetchBillingList } from '../redux/billingSlice';
import { routesName } from '../constants/routesName';
import { DataGrid } from '@mui/x-data-grid';
import { Loader } from '../../components/loader';
import BillPrint from './BillPrint';

const dateOptions = [
  { label: 'All', value: 'all' },
  { label: 'Last 3 Months', value: '3months' },
  { label: 'Last 6 Months', value: '6months' },
  { label: 'Financial Year', value: 'financialYear' }
];

const getDateRange = (filter, financialYear) => {
  const now = new Date();
  let from, to;
  if (filter === '3months') {
    to = now;
    from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  } else if (filter === '6months') {
    to = now;
    from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  } else if (filter === 'financialYear' && financialYear) {
    // Assuming financialYear is like "2024-25"
    const [startYear] = financialYear.split('-');
    from = new Date(Number(startYear), 3, 1); // April 1st
    to = new Date(Number(startYear) + 1, 2, 31); // March 31st next year
  }
  return { from, to };
};

const ListAllBilling = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { billings } = useSelector((state) => state.billing);
  const [open, setOpen] = useState(false);
  const [printData, setPrintData] = useState(false);

  // Filter states
  const [customerId, setCustomerId] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [financialYear, setFinancialYear] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  // For financial year dropdown
  const financialYearList = Array.from(
    new Set(billings.map(b => b.category || b.financialYear || '').filter(Boolean))
  );

  useEffect(() => {
    setOpen(true);
    dispatch(fetchBillingList()).then(() => {
      setOpen(false);
    });
  }, [dispatch]);

  useEffect(() => {
    let rows = billings;
    // Filter by customer ID
    if (customerId) {
      rows = rows.filter(row =>
        row.userId?.toLowerCase().includes(customerId.toLowerCase())
      );
    }
    // Filter by date range
    if (dateFilter !== 'all') {
      const { from, to } = getDateRange(dateFilter, financialYear);
      if (from && to) {
        rows = rows.filter(row => {
          const billDate = new Date(row.billingDate);
          return billDate >= from && billDate <= to;
        });
      }
    }
    setFilteredRows(rows);
  }, [billings, customerId, dateFilter, financialYear]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 40,
      renderCell: (params) => (
        <Typography variant="subtitle1" color="textSecondary">
          {params.value || 'N/A'}
        </Typography>
      )},
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
    { field: 'billingDate', headerName: 'Billing Date', width: 100,
      renderCell: (params) => (
        <Typography variant="subtitle1" color="textSecondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )},
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
  const paginationModel = { pageSize: 5, page: 0 };

  const safeRows = (filteredRows.length ? filteredRows : billings).map((row, idx) => ({
    ...row,
    id: row.id ?? idx + 1,
    role: row?.role?.rolename ? row?.role?.rolename : 'Unknown',
    status: row.status == 1 ? 'Active' : 'Inactive',
  }));

  // Export user Data to excel or csv
  const exportBillings = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      columns.map(col => col.headerName).join(",") + "\n" +
      safeRows.map(row => columns.map(col => row[col.field]).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billings${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handlePrint = (e) => {
    setPrintData(e);
  };
  const searchBillByID = () => {
    if (customerId) {
        dispatch(fetchBillingById(customerId)).then((res) => {
          if (res.payload.length === 0) {
            alert('No billing found for this Customer ID');
          } else {
            setFilteredRows(res.payload);
          }
        });
    } else {
      const { from, to } = getDateRange(dateFilter, financialYear);
      dispatch(fetchBillingByDateRange(new Date(from).toISOString(), new Date().toISOString())).then((res) => {
        if (res.payload.length === 0) {
          alert('No billing found for this date range');
        } else {
          setFilteredRows(res.payload);
        }
      }); 
    }
  };
  return (
    <>
      {printData ? 
        <BillPrint bill={printData} onClose={() => setPrintData(null)} /> 
        : 
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
          {/* Filters */}
          <Paper sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            border: 'none',
            background: 'linear-gradient(90deg, #f5f7fa 0%, #e0eafc 100%)',
            color: '#185a9d',
            padding: { xs: 2, sm: 3 },
            marginBottom: '24px',
            borderRadius: 3,
            boxShadow: 2,
            m: '20px'
          }}>
            <TextField
              label="Search by Customer ID"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              size="small"
              sx={{ minWidth: 200, background: '#fff', borderRadius: 1 }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
              or filter by date range:
            </Typography>
            <TextField
              select
              label="Date Range"
              name='dateRange'
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 180, background: '#fff', borderRadius: 1 }}
            >
              {dateOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            {dateFilter === 'financialYear' && (
              <TextField
                select
                label="Financial Year"
                value={financialYear}
                onChange={e => setFinancialYear(e.target.value)}
                size="small"
                sx={{ minWidth: 160, background: '#fff', borderRadius: 1 }}
              >
                {financialYearList.map((fy, idx) => (
                  <MenuItem key={idx} value={fy}>{fy}</MenuItem>
                ))}
              </TextField>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
                color: '#fff',
                boxShadow: 2,
                minWidth: 120
              }}
              onClick={() => {searchBillByID()}}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                boxShadow: 2,
                minWidth: 120
              }}
              onClick={() => {
                setCustomerId('');
                setDateFilter('all');
                setFinancialYear('');
              }}
            >
              Reset
            </Button>
          </Paper>
          {/* Attractive Header */}
          <Paper
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              border: 'none',
              background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
              color: '#fff',
              padding: { xs: 2, sm: 3 },
              marginBottom: '24px',
              borderRadius: 3,
              boxShadow: 3,
              m: '20px'
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
              List of All Billings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                  color: '#fff',
                  boxShadow: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}
                onClick={() => dispatch(fetchBillingList({}))}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
                  color: '#fff',
                  boxShadow: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}
                onClick={() => window.location.href = routesName.BILLING}
              >
                Add New Billing
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
                  color: '#fff',
                  boxShadow: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}
                onClick={exportBillings}
              >
                Export Billings
              </Button>
            </Box>
          </Paper>
          {/* Responsive DataGrid */}
          <Grid item xs={12} sx={{ justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
            <Paper sx={{
              width: '100%',
              borderRadius: 3,
              boxShadow: 3,
              p: { xs: 1, sm: 2 },
              ml: { xs: 0, sm: 10 },
              background: 'rgba(255,255,255,0.97)'
            }}>
              <DataGrid
                rows={safeRows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{
                  border: 0,
                  width: '100%',
                  '& .MuiDataGrid-columnHeaders': {
                    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                    fontWeight: 700,
                    fontSize: 16,
                  },
                  '& .MuiDataGrid-row:hover': {
                    background: 'rgba(67,206,162,0.08)',
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: 15,
                  },
                }}
                autoHeight
              />
            </Paper>
          </Grid>
          <Loader open={open} />
        </Box>
      }
    </>
  );
};

export default ListAllBilling;

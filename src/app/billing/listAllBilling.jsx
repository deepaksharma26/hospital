import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBillingList } from '../redux/billingSlice';
import { routesName } from '../constants/routesName';
import { DataGrid } from '@mui/x-data-grid';
import { render } from '@testing-library/react';
import { Loader } from '../../components/loader';

const ListAllBilling = () => { 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { billings } = useSelector((state) => state.billing);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  useEffect(async () => {
    setLoading(true);
      await dispatch(fetchBillingList());
      setLoading(false);
  }, [dispatch]);

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
        { field: 'paymentMethodDetails', headerName: 'Payment Method', width: 150 },

        // {
        //     field: 'status', renderCell: (params) =>
        //     (
        //         <Chip sx={{ width: 80 }} label={params.value} color={params.value == 'Active' ? 'success' : 'error'} />
        //     ), headerName: 'Status', width: 120
        // },
        {
            field: '',
            renderCell: (e) => (
                <>
                    <Button label="Modify" variant="outlined" color="warning" onClick={() => window.open(`${routesName.EDITBILLING}/${e.row._id}`, '_blank')} >Modify</Button>
                    <Button label="Print" variant="outlined" color='primary' sx={{ marginLeft: 1 }}>Print</Button>
                </>
            ),
            headerName: 'Modify', width: 280
        },
    ];
    const paginationModel = { pageSize: 5, page: 0 };

    const safeRows = billings.map((row, idx) => ({
        ...row,
        id: row.id ?? idx + 1, // Use existing id or fallback to index
        role: row?.role?.rolename ? row?.role?.rolename : 'Unknown', // Map role ID to role name
        status: row.status == 1 ? 'Active' : 'Inactive', // Map boolean status to string
    }));

    //export user Data to exvcel or csv
    const exportBillings = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            columns.map(col => col.headerName).join(",") + "\n" +
            safeRows.map(row => columns.map(col => row[col.field]).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `billings${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link); // Clean up
    };

  return (
   <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
                <Typography variant="h5" color="textSecondary">
                    List of All Billings
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => dispatch(fetchBillingList({}))}>
                    Refresh
                </Button>
                <Button variant="contained" color="secondary" sx={{ marginLeft: '10px' }} onClick={() => window.location.href = routesName.BILLING}>
                    Add New Billing
                </Button>
                <Button variant="contained" color="success" sx={{ marginLeft: '10px' }} onClick={() => exportBillings()}>
                    Export Billings
                </Button>
            </Box>
            <Grid item xs={12} sx={{ justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
                <Paper sx={{ width: '100%' }}>
                    <DataGrid
                        rows={safeRows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        sx={{ border: 0, width: '100%' }}
                    />
                </Paper>
            </Grid>

           <Loader open={open}/>
        </Box>
  );
};

export default ListAllBilling;

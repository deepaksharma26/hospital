import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, MenuItem, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesReport } from '../redux/reportSlice'; // You need to implement this action
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const dateOptions = [
  { label: 'All', value: 'all' },
  { label: 'Last 3 Months', value: '3months' },
  { label: 'Last 6 Months', value: '6months' },
  { label: 'Quarter Wise', value: 'quarter' },
  { label: 'Financial Year', value: 'financialYear' }
];

const SalesReport = () => {
  const dispatch = useDispatch();
  const { salesReport } = useSelector(state => state.report); // Add this to your redux
  const [dateFilter, setDateFilter] = useState('all');
  const [financialYear, setFinancialYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [customRange, setCustomRange] = useState({ from: null, to: null });

  useEffect(() => {
    // Dispatch with filters
    dispatch(fetchSalesReport({ dateFilter, financialYear, quarter, customRange }));
  }, [dispatch, dateFilter, financialYear, quarter, customRange]);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Sales & Tax Report
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Date Range"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              fullWidth
              size="small"
            >
              {dateOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {dateFilter === 'financialYear' && (
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Financial Year"
                value={financialYear}
                onChange={e => setFinancialYear(e.target.value)}
                fullWidth
                size="small"
              >
                {/* Replace with your actual financial year list */}
                {['2024-25', '2025-26'].map(fy => (
                  <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          {dateFilter === 'quarter' && (
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Quarter"
                value={quarter}
                onChange={e => setQuarter(e.target.value)}
                fullWidth
                size="small"
              >
                {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                  <MenuItem key={q} value={q}>{q}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          {dateFilter === 'custom' && (
            <>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="From"
                  value={customRange.from}
                  onChange={date => setCustomRange(r => ({ ...r, from: date }))}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="To"
                  value={customRange.to}
                  onChange={date => setCustomRange(r => ({ ...r, to: date }))}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Summary
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <Typography>Total Sales: <b>₹{salesReport?.totalSales?.toFixed(2) ?? '0.00'}</b></Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography>Total Tax: <b>₹{salesReport?.totalTax?.toFixed(2) ?? '0.00'}</b></Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography>Total Discount: <b>₹{salesReport?.totalDiscount?.toFixed(2) ?? '0.00'}</b></Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Payment Method Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {salesReport?.paymentMethods && Object.entries(salesReport.paymentMethods).map(([method, amount]) => (
            <Grid item xs={12} sm={3} key={method}>
              <Typography>{method}: <b>₹{parseFloat(amount).toFixed(2)}</b></Typography>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Tax Collection
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {salesReport?.taxCollection && Object.entries(salesReport.taxCollection).map(([taxType, amount]) => (
            <Grid item xs={12} sm={3} key={taxType}>
              <Typography>{taxType}: <b>₹{parseFloat(amount).toFixed(2)}</b></Typography>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Detailed Sales
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Bill No</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Payment Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesReport?.details?.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.billNo}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>₹{parseFloat(row.amount).toFixed(2)}</TableCell>
                  <TableCell>₹{parseFloat(row.tax).toFixed(2)}</TableCell>
                  <TableCell>₹{parseFloat(row.discount).toFixed(2)}</TableCell>
                  <TableCell>{row.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesReport;
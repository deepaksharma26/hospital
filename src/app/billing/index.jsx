import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch, useSelector } from 'react-redux';
import { fromatDate, windowWidth } from '../../utills';
import { fetchBillingCategories } from '../redux/billingCategorySlice';
import { fetchPaymentType } from '../redux/paymentTypeSlice';
import { fetchFinancialYear } from '../redux/financialYearSlice';
import { addBillingItem, fetchBillingItems } from '../redux/billingItemsSlice';
import { addBilling } from '../redux/billingSlice';

// const billingTypes = ['Consultation', 'Surgery', 'Medicine', 'Other'];
// const financialYears = ['2023-2024', '2024-2025', '2025-2026'];
// const paymentMethods = ['Cash', 'Card', 'UPI', 'Net Banking'];

function numberToWords(num) {
  if (num === 0) return 'Zero';
  if (typeof num !== 'number') num = Number(num);
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = num % 100;

  let result = '';
  if (crore) result += numberToWords(crore) + ' Crore ';
  if (lakh) result += numberToWords(lakh) + ' Lakh ';
  if (thousand) result += numberToWords(thousand) + ' Thousand ';
  if (hundred) result += a[hundred] + ' Hundred ';
  if (rest) {
    if (result !== '') result += 'and ';
    if (rest < 20) result += a[rest];
    else result += b[Math.floor(rest / 10)] + (rest % 10 ? ' ' + a[rest % 10] : '');
  }
  return result.trim();
}

const Billing = () => {
  const { billingCategory } = useSelector((state) => state.billingCategory);
  const { paymentType } = useSelector((state) => state.paymentType);
  const { financialYears } = useSelector((state) => state.financialYear);
  const { billingItems } = useSelector((state) => state.billingItems);
  const [newItems, setNewItems] = useState(billingItems || []);
  const dispactch = useDispatch();
  useEffect(() => {
    // Fetch billing categories or any other necessary data
    dispactch(fetchBillingCategories());
    dispactch(fetchPaymentType());
    dispactch(fetchFinancialYear());
    dispactch(fetchBillingItems());
  }, [dispactch]);
  const screenwidth = windowWidth();

  // Customer Info State
  const [customer, setCustomer] = useState({
    customerId: '',
    name: '',
    address: '',
    contact: '',
  });

  // Billing Details State
  const [billingDetails, setBillingDetails] = useState({
    billingType: '',
    financialYear: '',
    billingDate: new Date().toISOString().split('T')[0], // Default to today
  });

  // Billing Items State
  const [items, setItems] = useState([
    { itemName: '', quantity: 1, unitPrice: 0, amount: 0, discount: 0 }
  ]);

  // Other State
  const [remark, setRemark] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState({});

  // Handlers
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleBillingDetailsChange = (e) => {

    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handleItemChange = (idx, field, value) => {
    const newItemsArr = items.map((item, i) =>
      i === idx
        ? {

          ...item,
          [field]: field === 'quantity' || field === 'unitPrice' || field === 'discount'
            ? Number(value)
            : value,
          amount:
            field === 'quantity' || field === 'unitPrice' || field === 'discount'
              ? (field === 'discount'
                ? item.quantity * item.unitPrice?.$numberDecimal - Number(value)
                : field === 'quantity'
                  ? Number(value) * item.unitPrice?.$numberDecimal - item.discount
                  : item.quantity * Number(value) - item.discount?.$numberDecimal)
              : item.quantity * item.unitPrice?.$numberDecimal - item.discount?.$numberDecimal,
        }
        : item
    );

    setItems(newItemsArr);
    // For itemName field, filter suggestions
    if (field === 'itemName') {
      const filtered = billingItems && billingItems
        .filter((suggestion) =>
          suggestion.name.toLowerCase().includes(value.toLowerCase())
        );
      setItemSuggestions((prev) => ({ ...prev, [idx]: filtered }));
    }
  };

  const handleAddItem = () => {
    setItems([...items, { itemName: '', quantity: 1, unitPrice: 0, amount: 0, discount: 0 }]);
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSuggestionClick = (idx, suggestion) => {
    const newItemsArr = items.map((item, i) =>
      i === idx
        ? {
          ...item,
          itemName: suggestion.name,
          unitPrice: suggestion.unitPrice || 0,
          amount: item.quantity * (suggestion.unitPrice?.$numberDecimal || 0) - item.discount,
        }
        : item
    );
    setItems(newItemsArr);
    setItemSuggestions((prev) => ({ ...prev, [idx]: [] }));
  };

  // Billing Summary
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // Submit Handler (for demo)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    const data = {
      userId: customer.customerId,
      plan: billingDetails.billingType,
      details: remark,
      billingDetails: items.map(item => ({
        billingItems: item._id,
        name: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.amount,
        description: item.description || '',
        tax: item.tax || 0,
        discount: item.discount || 0,
      })),
      category: billingDetails.financialYear,
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: billingDetails.billingDate || new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due date 30 days from now
      totalAmount: totalAmount,
      taxAmount: items.reduce((sum, item) => sum + (item.tax || 0), 0),
      discountAmount: items.reduce((sum, item) => sum + (item.discount || 0), 0),
      finalAmount: totalAmount + items.reduce((sum, item) => sum + (item.tax || 0), 0) - items.reduce((sum, item) => sum + (item.discount || 0), 0),
      currency: 'INR',
      paymentStatus: 'Pending',
      paymentDate: null,
      paymentReference: '',
      paymentMethodDetails: paymentMethod,
    }
    dispactch(addBilling(data)).then(() => {
      // Handle success, e.g., show a success message or redirect
      console.log('Billing item added successfully:', data);
      //   window.location.href = '/list-all-users'; // Redirect to user list after submission
    }).catch((error) => {
      // Handle error, e.g., show an error message
      console.error('Error adding billing item:', error);
    });
    alert('Billing submitted!');
  };

  return (
    <Box sx={{ width: (screenwidth - 240) + 'px' }}>
      <Box sx={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
        <Typography variant="h5" color="textSecondary">
          User Billing Information
        </Typography>

        <TextField
          label="Billing Date"
          name="billingDate"
          type="date"
          value={billingDetails.billingDate}
          onChange={handleBillingDetailsChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
          sx={{ display: 'none', marginLeft: '20px', marginRight: '20px', width: '200px', }}
        />
        <Button variant="contained" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => window.location.href = '/list-all-billings'}>
          Search Billings
        </Button>
      </Box>
      <Box sx={{ minWidth: 550 }}>

        <form onSubmit={handleSubmit}>
          {/* Customer Info Section */}
          <Paper sx={{ mb: 2, }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #CECECE', padding: '10px', pt: 2, mb: 2, backgroundColor: '#f5f5f5', height: '20px' }}>
              <Typography variant="h6" gutterBottom>Customer Info</Typography>
              <Typography variant="h6" sx={{ textAlign: 'right', justifyContent: 'flex-end' }} gutterBottom>Date: {fromatDate(billingDetails.billingDate)}</Typography>
            </Box>

            <Grid container spacing={2} sx={{ padding: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField label="Customer ID" name="customerId" value={customer.customerId} onChange={handleCustomerChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Name" name="name" value={customer.name} onChange={handleCustomerChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Address" name="address" value={customer.address} onChange={handleCustomerChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Contact" name="contact" value={customer.contact} onChange={handleCustomerChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Billing Type"
                  name="billingType"
                  value={billingDetails.billingType}
                  onChange={handleBillingDetailsChange}
                  fullWidth
                  required
                  sx={{ width: 180 }}
                >
                  {billingCategory && billingCategory.map((type) => (
                    <MenuItem key={type} value={type}>{type?.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

            </Grid>
          </Paper>

          {/* Billing Details Section */}
          <Paper sx={{ p: 2, mb: 3, display: 'none' }}>
            <Typography variant="h6" gutterBottom>Billing Details</Typography>
            <Grid container spacing={2}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>


                <TextField
                  select
                  label="Financial Year"
                  name="financialYear"
                  value={billingDetails.financialYear ? billingDetails.financialYear : '2025-26'}
                  onChange={handleBillingDetailsChange}
                  fullWidth
                  required
                  disabled={true}
                >
                  {financialYears && financialYears.map((year) => (
                    <MenuItem key={year?._id} value={year?.name} selected={true} >{year?.name}</MenuItem>
                  ))}
                </TextField>


              </Box>
            </Grid>
          </Paper>

          {/* Billing Items Section */}
          <Paper sx={{ p: 2, mb: 3, minHeight: 300 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #CECECE', padding: '10px', pt: 2, mb: 2, backgroundColor: '#f5f5f5', height: '20px' }}>
              <Typography variant="h6" gutterBottom>Billing Details</Typography>
              <Typography variant="h6" sx={{ textAlign: 'right', justifyContent: 'flex-end' }} gutterBottom>Financial Year: {billingDetails.financialYear ? billingDetails.financialYear : '2025-26'}</Typography>
            </Box>
            <TableContainer sx={{ minHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ position: 'relative' }}>
                        <TextField
                          value={item.itemName}
                          onChange={e => handleItemChange(idx, 'itemName', e.target.value)}
                          placeholder="Item Name"
                          size="small"
                          required
                          autoComplete="off"
                          onKeyDown={e => {
                            if (
                              e.key === 'Tab' &&
                              itemSuggestions[idx] &&
                              itemSuggestions[idx].length > 0
                            ) {
                              e.preventDefault();
                              handleSuggestionClick(idx, itemSuggestions[idx][0]);
                            }
                          }}
                        />
                        {itemSuggestions[idx] && itemSuggestions[idx].length > 0 && (
                          console.log('Item Suggestions:', itemSuggestions),
                          <Box
                            sx={{
                              position: 'absolute',
                              zIndex: 10,
                              background: '#fff',
                              boxShadow: 2,
                              borderRadius: 1,
                              mt: 1,
                              width: '100%',
                              maxHeight: 180,
                              overflowY: 'auto',
                            }}
                          >
                            {itemSuggestions[idx].map((suggestion, sIdx) => (

                              console.log('Suggestion:', suggestion),
                              <Box
                                key={suggestion._id || sIdx}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #eee',
                                  '&:hover': { backgroundColor: '#f0f0f0' },
                                }}
                                onClick={() => handleSuggestionClick(idx, suggestion)}
                              >
                                {suggestion.name}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                          size="small"
                          inputProps={{ min: 1 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.unitPrice?.$numberDecimal}
                          onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                          size="small"
                          inputProps={{ min: 0 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.discount?.$numberDecimal}
                          onChange={e => handleItemChange(idx, 'discount', e.target.value)}
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography>{item.amount.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleRemoveItem(idx)} disabled={items.length === 1}>
                          <RemoveCircleIcon />
                        </IconButton>
                        {idx === items.length - 1 && (
                          <IconButton color="primary" onClick={handleAddItem}>
                            <AddCircleIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Billing Summary Section */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Billing Summary</Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', flex: 1, width: '100%', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="subtitle1">
                Total Amount: <b>₹{totalAmount.toFixed(2)}</b>
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, alignSelf: 'flex-end', ml: 2 }}>
                In Words: <i>{numberToWords(Math.floor(totalAmount))} Rupees Only</i>
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flex: 1, width: '100%', flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
              <TextField
                label="Remark"
                value={remark}
                onChange={e => setRemark(e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Customer Note"
                value={customerNote}
                onChange={e => setCustomerNote(e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
              <TextField
                select
                label="Payment Method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                required
              >
                {paymentType && paymentType.map((method) => (
                  <MenuItem key={method?._id} value={method?._id}>{method?.paymentType}</MenuItem>
                ))}
              </TextField>
            </Box>

          </Paper>
          <Divider sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" size="large">
            Submit Billing
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Billing;
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, windowWidth } from '../../utills';
import { fetchBillingCategories } from '../redux/billingCategorySlice';
import { fetchPaymentType } from '../redux/paymentTypeSlice';
import { fetchFinancialYear } from '../redux/financialYearSlice';
import { fetchBillingItems } from '../redux/billingItemsSlice';
import { updateBilling, fetchBillingById, addBilling } from '../redux/billingSlice';
import { routesName } from '../constants/routesName';
import { useParams } from 'react-router-dom';

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

const EditBilling = () => {
  const billingId = useParams().billingId;
  const { billingCategory } = useSelector((state) => state.billingCategory);
  const { paymentType } = useSelector((state) => state.paymentType);
  const { financialYears } = useSelector((state) => state.financialYear);
  const { billingItems } = useSelector((state) => state.billingItems);
  const [newItems, setNewItems] = useState(billingItems || []);
  const dispatch = useDispatch();
  const { billingData } = useSelector((state) => state.billing);
  const [data, setData] = useState(billingData || {});
  useEffect(() => {
    dispatch(fetchBillingById(billingId)).then((res) => {
      if (res.error) {
        console.error('Error fetching billing data:', res.error);
        return;
      }
      setData(res.payload);
      setCustomer({
        customerId: res.payload.userId,
        name: res.payload.customerName || '',
        address: res.payload.customerAddress || '',
        contact: res.payload.customerPhone || '',
      });
      setBillingDetails({
        billingType: res.payload.plan || '',
        financialYear: res.payload.category || '',
        billingDate: res.payload.invoiceDate ? new Date(res.payload.invoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
      setItems(res.payload.billingDetails.map(item => ({
        billingItems: item.billingItems || '',
        itemName: item.name || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        taxPercent: item.taxPercent || 0,
        tax: item.tax || 0,
        amount: item.totalPrice || 0,
        discount: item.discount || 0,
      })));
      setRemark(res.payload.details || '');
      setCustomerNotes(res.payload.customerNotes || '');
      setPaymentMethod(res.payload.paymentMethodDetails || '');
      setItemSuggestions({});
      setHighlightedSuggestion({});
    }).catch((error) => {
      console.error('Error fetching billing data:', error);
    });
    // Fetch billing categories or any other necessary data
    dispatch(fetchBillingCategories());
    dispatch(fetchPaymentType());
    dispatch(fetchFinancialYear());
    dispatch(fetchBillingItems());
  }, [dispatch, billingId]);
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
    { billingItems:'', itemName: '', quantity: 1, unitPrice: 0, taxPercent: 0, tax: 0, amount: 0, discount: 0 }
  ]);

  // Other State
  const [remark, setRemark] = useState('');
  const [customerNotes, setCustomerNotes ] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState({});
  const [highlightedSuggestion, setHighlightedSuggestion] = useState({});

  // Handlers
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleBillingDetailsChange = (e) => {

    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handleItemChange = (idx, field, value) => {
    const newItemsArr = items.map((item, i) => {
      if (i !== idx) return item;

      // Ensure all values are numbers
      const getNumber = v =>
        typeof v === 'object' && v !== null && '$numberDecimal' in v
          ? Number(v.$numberDecimal)
          : Number(v) || 0;

      let updated = { ...item, [field]: ['quantity', 'unitPrice', 'discount', 'taxPercent', 'tax'].includes(field) ? getNumber(value) : value };

      // Always use numbers for calculations
      updated.unitPrice = getNumber(updated.unitPrice);
      updated.quantity = getNumber(updated.quantity);
      updated.discount = getNumber(updated.discount);
      updated.taxPercent = getNumber(updated.taxPercent);
      updated.tax = getNumber(updated.tax);

      // Calculate tax if taxPercent, unitPrice, or quantity changes
      if (field === 'taxPercent' || field === 'unitPrice' || field === 'quantity') {
        updated.tax = ((updated.unitPrice * updated.quantity * updated.taxPercent) / 100).toFixed(2);
      }

      // If tax is changed directly, update taxPercent accordingly
      if (field === 'tax') {
        updated.taxPercent = updated.unitPrice && updated.quantity
          ? ((updated.tax * 100) / (updated.unitPrice * updated.quantity)).toFixed(2) 
          : 0;
      }

      // Calculate amount: (unitPrice * quantity) + tax - discount
      updated.amount = updated.unitPrice * updated.quantity + updated.tax - updated.discount;

      return updated;
    });
    setItems(newItemsArr);

    // For itemName field, filter suggestions
    if (field === 'itemName') {
      const filtered = billingItems && billingItems
        .filter((suggestion) =>
          suggestion.name.toLowerCase().includes(value.toLowerCase())
        );
      setItemSuggestions((prev) => ({ ...prev, [idx]: filtered }));
      setHighlightedSuggestion(prev => ({ ...prev, [idx]: undefined }));
    }
  };

  const handleAddItem = () => {
    setItems([...items, {billingItems:'', itemName: '', quantity: 0, unitPrice: 0, taxPercent: 0, tax: 0, amount: 0, discount: 0 }]);
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSuggestionClick = (idx, suggestion) => {
    const getNumber = v =>
      typeof v === 'object' && v !== null && '$numberDecimal' in v
        ? Number(v.$numberDecimal)
        : Number(v) || 0;

    const newItemsArr = items.map((item, i) => {
      if (i !== idx) return item;

      const unitPrice = getNumber(suggestion.unitPrice);
      const quantity = getNumber(suggestion.quantity) || 1;
      const taxPercent = getNumber(suggestion.taxPercent || suggestion.tax_percent || 0);
      let tax = getNumber(suggestion.tax);
      // If taxPercent is provided, recalculate tax
      if (taxPercent) {
        tax = (unitPrice * quantity * taxPercent) / 100;
      }
      const discount = getNumber(suggestion.discount);

      // Calculate amount: (unitPrice * quantity) + tax - discount
      const amount = unitPrice * quantity + tax - discount;

      return {
        ...item,
        billingItems: suggestion._id,
        itemName: suggestion.name,
        quantity,
        unitPrice,
        taxPercent,
        tax,
        discount,
        amount,
      };
    });

    setItems(newItemsArr);
    setItemSuggestions((prev) => ({ ...prev, [idx]: [] }));
  };

  // Billing Summary
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = items.reduce((sum, item) => {
    let tax = item.tax;
    if (typeof tax === 'object' && tax !== null && '$numberDecimal' in tax) {
      tax = Number(tax.$numberDecimal);
    } else {
      tax = Number(tax) || 0;
    }
    return sum + tax;
  }, 0);
  const totalDiscount = items.reduce((sum, item) => {
    let discount = item.discount;
    if (typeof discount === 'object' && discount !== null && '$numberDecimal' in discount) {
      discount = Number(discount.$numberDecimal);
    } else {
      discount = Number(discount) || 0;
    }
    return sum + discount;
  }, 0);

  // Submit Handler (for demo)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    const data = {
      id: billingId,
      userId: customer.customerId,
      plan: billingDetails?.billingType || '',
      details: remark,
      billingDetails: items.map(item => ({
        billingItems: item.billingItems ? item.billingItems : '',
        name: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.amount, 
        tax: item.tax || 0,
        discount: item.discount || 0,
      })),
      customerName: customer.name,
      customerAddress: customer.address,
      customerPhone: customer.contact,
      customerNotes: customerNotes,
      category: billingDetails.financialYear,
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: billingDetails.billingDate || new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due date 30 days from now
      totalAmount: totalAmount,
      taxAmount: items.reduce((sum, item) => sum + (parseFloat(item.tax) || 0), 0),
      discountAmount: items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0),
      finalAmount: totalAmount + items.reduce((sum, item) => sum + (parseFloat(item.tax) || 0), 0) - items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0),
      currency: 'INR',
      paymentStatus: 'Pending',
      paymentDate: new Date(),
      paymentReference: '',
      paymentMethodDetails: paymentMethod,
    };
    console.log('Submitting data:', data);  
    dispatch(updateBilling(data)).then((res) => {
      if (res.error) {
        console.error('Error updating billing item:', res.error);
        return;
      }else {
        // Reset form after successful submission
        // window.location.href = '/list-billings';
      }
       
      //   window.location.href = '/list-all-users'; // Redirect to user list after submission
    }).catch((error) => {
      // Handle error, e.g., show an error message
      console.error('Error adding billing item:', error);
    }); 
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
        <Button variant="contained" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => window.location.href = routesName.LISTBILLIS}>
          Search Billings
        </Button>
      </Box>
      <Box sx={{ minWidth: 550 }}>

        <form onSubmit={handleSubmit}>
          {/* Customer Info Section */}
          <Paper sx={{ mb: 2, }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #CECECE', padding: '10px', pt: 2, mb: 2, backgroundColor: '#f5f5f5', height: '20px' }}>
              <Typography variant="h6" gutterBottom>Customer Info</Typography>
              <Typography variant="h6" sx={{ textAlign: 'right', justifyContent: 'flex-end' }} gutterBottom>Date: {formatDate(billingDetails.billingDate)}</Typography>
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
                    <MenuItem key={type} value={type?.name}>{type?.name}</MenuItem>
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
                    <TableCell width={'450rem'}>Item Name</TableCell>
                    <TableCell width={'60rem'}>Quantity</TableCell>
                    <TableCell width={'120rem'}>Unit Price</TableCell>
                    <TableCell width={'80rem'}>Tax %</TableCell> {/* Add this */}
                    <TableCell width={'80rem'}>Tax</TableCell>
                    <TableCell width={'80rem'}>Discount</TableCell>
                    <TableCell width={'60rem'}>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ position: 'relative' }}>
                        <TextField
                          fullWidth
                          value={item.itemName}
                          onChange={e => handleItemChange(idx, 'itemName', e.target.value)}
                          placeholder="Item Name"
                          size="small"
                          required
                          autoComplete="off"
                          InputProps={{
                            endAdornment: item.itemName && (
                              <IconButton
                                size="small"
                                onClick={() => handleItemChange(idx, 'itemName', '')}
                                edge="end"
                                aria-label="clear"
                              >
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            ),
                          }}
                          onKeyDown={e => {
                            if (itemSuggestions[idx] && itemSuggestions[idx].length > 0) {
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setHighlightedSuggestion(prev => ({
                                  ...prev,
                                  [idx]: prev[idx] === undefined || prev[idx] === itemSuggestions[idx].length - 1
                                    ? 0
                                    : prev[idx] + 1
                                }));
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setHighlightedSuggestion(prev => ({
                                  ...prev,
                                  [idx]: !prev[idx] || prev[idx] === 0
                                    ? itemSuggestions[idx].length - 1
                                    : prev[idx] - 1
                                }));
                              } else if (e.key === 'Tab' || e.key === 'Enter') {
                                if (highlightedSuggestion[idx] !== undefined && itemSuggestions[idx][highlightedSuggestion[idx]]) {
                                  e.preventDefault();
                                  handleSuggestionClick(idx, itemSuggestions[idx][highlightedSuggestion[idx]]);
                                  setHighlightedSuggestion(prev => ({ ...prev, [idx]: undefined }));
                                }
                              }
                            }
                          }}
                        />
                        {itemSuggestions[idx] && itemSuggestions[idx].length > 0 && (
                          console.log('Item Suggestions:', itemSuggestions),
                          <Box
                            fullWidth
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
                                  backgroundColor: highlightedSuggestion[idx] === sIdx ? '#e3f2fd' : '#fff',
                                  '&:hover': { backgroundColor: '#f0f0f0' },
                                }}
                                onMouseEnter={() => setHighlightedSuggestion(prev => ({ ...prev, [idx]: sIdx }))}
                                onMouseLeave={() => setHighlightedSuggestion(prev => ({ ...prev, [idx]: undefined }))}
                                onClick={() => {
                                  handleSuggestionClick(idx, suggestion);
                                  setHighlightedSuggestion(prev => ({ ...prev, [idx]: undefined }));
                                }}
                              >
                                {suggestion.name}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                          size="small"
                          inputProps={{ min: 1 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          value={
                            typeof item.unitPrice === 'object' && item.unitPrice !== null && '$numberDecimal' in item.unitPrice
                              ? item.unitPrice.$numberDecimal
                              : item.unitPrice
                          }
                          onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                          size="small"
                          inputProps={{ min: 0 }}
                          required
                        />
                      </TableCell> 
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          value={item.taxPercent}
                          onChange={e => handleItemChange(idx, 'taxPercent', e.target.value)}
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          value={item.tax}
                          onChange={e => handleItemChange(idx, 'tax', e.target.value)}
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          type="text"
                          value={item.discount}
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
              <Typography variant="subtitle1">
                Total Tax: <b>₹{totalTax? parseFloat(totalTax).toFixed(2): 0}</b>
              </Typography>
              <Typography variant="subtitle1">
                Total Discount: <b>₹{totalDiscount.toFixed(2)}</b>
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, alignSelf: 'flex-end', ml: 2 }}>
                In Words: <i>{numberToWords(Math.floor(totalAmount + totalTax))} Rupees Only</i>
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
                label="Customer Notes"
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
              <TextField
                select
                label="Payment Method"
                name='paymentMethod'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                required
              >
                {paymentType && paymentType.map((method) => (
                  <MenuItem key={method?.paymentType} value={method?.paymentType}>{method?.paymentType}</MenuItem>
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

export default EditBilling;
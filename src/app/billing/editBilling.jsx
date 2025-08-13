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
import { updateBilling, fetchBillingById } from '../redux/billingSlice';
import { routesName } from '../constants/routesName';
import { useNavigate, useParams } from 'react-router-dom';

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
  const dispatch = useDispatch();
  const { billingData } = useSelector((state) => state.billing);
  const screenwidth = windowWidth();

  // States
  const [customer, setCustomer] = useState({
    customerId: '',
    name: '',
    address: '',
    contact: '',
  });
  const [billingDetails, setBillingDetails] = useState({
    billingType: '',
    financialYear: '',
    billingDate: new Date().toISOString().split('T')[0],
  });
  const [items, setItems] = useState([
    { billingItems:'', itemName: '', quantity: 1, unitPrice: 0, taxPercent: 0, tax: 0, amount: 0, discount: 0 }
  ]);
  const [remark, setRemark] = useState('');
  const [customerNotes, setCustomerNotes ] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState({});
  const [highlightedSuggestion, setHighlightedSuggestion] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchBillingById(billingId)).then((res) => {
      if (res.error) {
        console.error('Error fetching billing data:', res.error);
        return;
      }
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
    dispatch(fetchBillingCategories());
    dispatch(fetchPaymentType());
    dispatch(fetchFinancialYear());
    dispatch(fetchBillingItems());
  }, [dispatch, billingId]);

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
      const getNumber = v =>
        typeof v === 'object' && v !== null && '$numberDecimal' in v
          ? Number(v.$numberDecimal)
          : Number(v) || 0;
      let updated = { ...item, [field]: ['quantity', 'unitPrice', 'discount', 'taxPercent', 'tax'].includes(field) ? getNumber(value) : value };
      updated.unitPrice = getNumber(updated.unitPrice);
      updated.quantity = getNumber(updated.quantity);
      updated.discount = getNumber(updated.discount);
      updated.taxPercent = getNumber(updated.taxPercent);
      updated.tax = getNumber(updated.tax);
      if (field === 'taxPercent' || field === 'unitPrice' || field === 'quantity') {
        updated.tax = ((updated.unitPrice * updated.quantity * updated.taxPercent) / 100).toFixed(2);
      }
      if (field === 'tax') {
        updated.taxPercent = updated.unitPrice && updated.quantity
          ? ((updated.tax * 100) / (updated.unitPrice * updated.quantity)).toFixed(2) 
          : 0;
      }
      updated.amount = updated.unitPrice * updated.quantity + Number(updated.tax) - updated.discount;
      return updated;
    });
    setItems(newItemsArr);
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
    setItems([...items, {billingItems:'', itemName: '', quantity: 1, unitPrice: 0, taxPercent: 0, tax: 0, amount: 0, discount: 0 }]);
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
      if (taxPercent) {
        tax = (unitPrice * quantity * taxPercent) / 100;
      }
      const discount = getNumber(suggestion.discount);
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

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
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
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
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
    dispatch(updateBilling(data)).then((res) => {
      if (res.error) {
        console.error('Error updating billing item:', res.error);
        return;
      } else {
        setTimeout(() => {
          navigate(routesName.LISTBILLIS);
        }, 1000); 
      }
    }).catch((error) => {
      console.error('Error adding billing item:', error);
    }); 
  };

  return (
    <Box sx={{
      width: { xs: '100%', md: (screenwidth - 240) + 'px' },
      mx: 'auto',
      mt: 3,
      p: { xs: 1, sm: 2 }
    }}>
      {/* Header */}
      <Paper sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
        color: '#fff',
        borderRadius: 3,
        boxShadow: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <Typography variant="h5" fontWeight="bold">
          Edit Billing Information
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
            color: '#fff',
            boxShadow: 2,
            mt: { xs: 2, md: 0 },
            '&:hover': {
              background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
            },
          }}
          onClick={() => navigate(routesName.LISTBILLIS)}
        >
          Search Billings
        </Button>
      </Paper>

      {/* Customer Info Section */}
      <Paper sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        boxShadow: 2,
        background: 'rgba(255,255,255,0.97)'
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Customer ID"
              name="customerId"
              value={customer.customerId}
              onChange={handleCustomerChange}
              fullWidth
              required
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Name"
              name="name"
              value={customer.name}
              onChange={handleCustomerChange}
              fullWidth
              required
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Address"
              name="address"
              value={customer.address}
              onChange={handleCustomerChange}
              fullWidth
              required
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Contact"
              name="contact"
              value={customer.contact}
              onChange={handleCustomerChange}
              fullWidth
              required
              inputProps={{ autoComplete: 'off' }}
            />
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
              inputProps={{ autoComplete: 'off' }}
            >
              {billingCategory && billingCategory.map((type) => (
                <MenuItem key={type} value={type?.name}>{type?.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Financial Year"
              name="financialYear"
              value={billingDetails.financialYear ? billingDetails.financialYear : '2025-26'}
              onChange={handleBillingDetailsChange}
              fullWidth
              required
              sx={{ width: 180 }}
              inputProps={{ autoComplete: 'off' }}
            >
              {financialYears && financialYears.map((year) => (
                <MenuItem key={year?._id} value={year?.name}>{year?.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Billing Date"
              name="billingDate"
              type="date"
              value={billingDetails.billingDate}
              onChange={handleBillingDetailsChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Billing Items Section */}
      <Paper sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
        background: 'rgba(255,255,255,0.97)'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          borderBottom: '1px solid #CECECE',
          padding: '10px',
          mb: 2,
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="h6" gutterBottom>Billing Details</Typography>
          <Typography variant="h6" sx={{ textAlign: 'right', justifyContent: 'flex-end' }} gutterBottom>
            Financial Year: {billingDetails.financialYear ? billingDetails.financialYear : '2025-26'}
          </Typography>
        </Box>
        <TableContainer sx={{ minHeight: 300 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={'450rem'}>Item Name</TableCell>
                <TableCell width={'60rem'}>Quantity</TableCell>
                <TableCell width={'120rem'}>Unit Price</TableCell>
                <TableCell width={'80rem'}>Tax %</TableCell>
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
                      inputProps={{ min: 1, autoComplete: 'off' }}
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
                      inputProps={{ min: 0, autoComplete: 'off' }}
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
                      inputProps={{ min: 0, autoComplete: 'off' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="text"
                      value={item.tax}
                      onChange={e => handleItemChange(idx, 'tax', e.target.value)}
                      size="small"
                      inputProps={{ min: 0, autoComplete: 'off' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="text"
                      value={item.discount}
                      onChange={e => handleItemChange(idx, 'discount', e.target.value)}
                      size="small"
                      inputProps={{ min: 0, autoComplete: 'off' }}
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
      <Paper sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
        background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
        color: '#fff'
      }}>
        <Typography variant="h6" gutterBottom>Billing Summary</Typography>
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          width: '100%',
          gap: 2
        }}>
          <Box>
            <Typography variant="subtitle1">
              Total Amount: <b>₹{totalAmount.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle1">
              Total Tax: <b>₹{totalTax ? parseFloat(totalTax).toFixed(2) : 0}</b>
            </Typography>
            <Typography variant="subtitle1">
              Total Discount: <b>₹{totalDiscount.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              In Words: <i>{numberToWords(Math.floor(totalAmount + totalTax))} Rupees Only</i>
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: 'flex-end',
            width: { xs: '100%', md: 'auto' }
          }}>
            <TextField
              label="Remark"
              value={remark}
              onChange={e => setRemark(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{ minWidth: 180, background: '#fff', borderRadius: 1 }}
              inputProps={{ autoComplete: 'off' }}
            />
            <TextField
              label="Customer Notes"
              value={customerNotes}
              onChange={e => setCustomerNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{ minWidth: 180, background: '#fff', borderRadius: 1 }}
              inputProps={{ autoComplete: 'off' }}
            />
            <TextField
              select
              label="Payment Method"
              name='paymentMethod'
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              required
              sx={{ minWidth: 180, background: '#fff', borderRadius: 1 }}
              inputProps={{ autoComplete: 'off' }}
            >
              {paymentType && paymentType.map((method) => (
                <MenuItem key={method?.paymentType} value={method?.paymentType}>{method?.paymentType}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="secondary" size="large"
            onClick={handleSubmit}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
              color: '#fff',
              boxShadow: 2,
              '&:hover': {
                background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
              },
            }}>
            Submit Billing
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditBilling;
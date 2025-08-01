import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, IconButton, MenuItem
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { addBillingItem, deleteBillingItem, fetchBillingItems, updateBillingItem } from '../redux/billingItemsSlice';
import { fetchBillingCategories } from '../redux/billingCategorySlice';
import { useDispatch, useSelector } from 'react-redux';

const initialItem = {
  _id: '',
  name: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  tax: 0,
  discount: 0,
  category: '',
};

const BillingItem = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialItem);
  const [editIdx, setEditIdx] = useState(null);
  const { billingCategory } = useSelector((state) => state.billingCategory);
  const { billingItems } = useSelector((state) => state.billingItems);
  // const billingCategory=[]
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch initial billing items if needed
    dispatch(fetchBillingItems());
    dispatch(fetchBillingCategories());
  }, []);
  // Calculate total price
  const calculateTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxed = subtotal + item.tax;
    const discounted = taxed - item.discount;
    return discounted > 0 ? discounted : 0;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: name === 'quantity' || name === 'unitPrice' || name === 'tax' || name === 'discount' ? Number(value) : value };
    updated.totalPrice = calculateTotal(updated);
    setForm(updated);
  };

  // Add new item
  const handleAdd = () => {
    dispatch(addBillingItem(form)).then((res) => {
      if (res.payload) {
        setItems([...items, { ...form, totalPrice: calculateTotal(form) }]);
      }
      setForm(initialItem);
    }).catch((error) => {
      console.error('Error adding billing item:', error);
    }); 
  };

  // Edit item
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setForm(items[idx]);
  };

  // Update item
  const handleUpdate = () => {
    dispatch(updateBillingItem({ ...form, totalPrice: calculateTotal(form) })).then((res) => {
      if (res.payload) {
        const updatedItems = items.map((item, idx) => (idx === editIdx ? { ...form, totalPrice: calculateTotal(form) } : item));
        setItems(updatedItems);
      }
      setEditIdx(null);
      setForm(initialItem);
    }).catch((error) => {
      console.error('Error updating billing item:', error);
    });

    // const updatedItems = items.map((item, idx) => (idx === editIdx ? { ...form, totalPrice: calculateTotal(form) } : item));
    // setItems(updatedItems);
    // setEditIdx(null);
    // setForm(initialItem);
  };

  // Delete item
  const handleDelete = (idx) => {
    dispatch(deleteBillingItem(items[idx]._id)).then((res) => {
      if (res.payload) {
          setItems(items.filter((_, i) => i !== idx));
          setEditIdx(null);
          setForm(initialItem);
      }
    }).catch((error) => {
      console.error('Error deleting billing item:', error);
    }); 
  };

  // Cancel edit
  const handleCancel = () => {
    setEditIdx(null);
    setForm(initialItem);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editIdx !== null ? 'Edit Billing Item' : 'Add Billing Item'}
        </Typography>
        <Box component="form" sx={{ display: 'flex', width:'100%', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required 
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange} 
          />
          <TextField
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required 
            sx={{ minWidth: 200 }}
          >
            {billingCategory && billingCategory.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 2 }}>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            inputProps={{ min: 1 }}
            sx={{ minWidth: 100 }}
          />
          <TextField
            label="Unit Price"
            name="unitPrice"
            type="number"
            value={form.unitPrice}
            onChange={handleChange}
            required
            inputProps={{ min: 0 }}
            sx={{ minWidth: 100 }}
          />
          <TextField
            label="Tax"
            name="tax"
            type="number"
            value={form.tax}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            sx={{ minWidth: 80 }}
          />
          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            sx={{ minWidth: 80 }}
          />
           
          {editIdx !== null ? (
            <>
              <IconButton color="primary" onClick={handleUpdate}><SaveIcon /></IconButton>
              <IconButton color="error" onClick={handleCancel}><CancelIcon /></IconButton>
            </>
          ) : (
            <IconButton color="primary" onClick={handleAdd}><AddCircleIcon /></IconButton>
          )}
        </Box>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Billing Items List
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingItems && billingItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                  <TableCell>{item?.quantity}</TableCell>
                  <TableCell>{item?.unitPrice?.$numberDecimal}</TableCell>
                  <TableCell>{item?.tax?.$numberDecimal}</TableCell>
                  <TableCell>{item?.discount?.$numberDecimal}</TableCell>
                  <TableCell>{billingCategory.find(c => c._id === item.billingCategory)?.name || ''}</TableCell>
                  <TableCell>{parseFloat(item?.totalPrice?.$numberDecimal).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(idx)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">No billing items added.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default BillingItem;
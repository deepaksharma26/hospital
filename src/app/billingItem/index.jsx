import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

const BillingItem = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 1,
    unitPrice: '',
    taxPercent: '',
    tax: 0,
    discountPercent: '',
    discount: 0,
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch items and categories
  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/billing-item');
      setItems(res.data || []);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch items', severity: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/billing-category');
      setCategories(res.data || []);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch categories', severity: 'error' });
    }
  };

  // Calculate tax and discount whenever relevant fields change
  useEffect(() => {
    const quantity = Number(form.quantity) || 1;
    const unitPrice = Number(form.unitPrice) || 0;
    const taxPercent = Number(form.taxPercent) || 0;
    const discountPercent = Number(form.discountPercent) || 0;

    const tax = ((unitPrice * quantity) * taxPercent) / 100;
    const discount = ((unitPrice * quantity) * discountPercent) / 100;

    setForm((prev) => ({
      ...prev,
      tax: tax,
      discount: discount,
    }));
    // eslint-disable-next-line
  }, [form.quantity, form.unitPrice, form.taxPercent, form.discountPercent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/billing-item/${editId}`, form);
        setSnackbar({ open: true, message: 'Item updated!', severity: 'success' });
      } else {
        await axios.post('/api/billing-item', form);
        setSnackbar({ open: true, message: 'Item created!', severity: 'success' });
      }
      setForm({
        name: '',
        description: '',
        category: '',
        quantity: 1,
        unitPrice: '',
        taxPercent: '',
        tax: 0,
        discountPercent: '',
        discount: 0,
      });
      setEditId(null);
      fetchItems();
    } catch {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      category: item.category?._id || item.category || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice,
      taxPercent: item.taxPercent,
      tax: item.tax,
      discountPercent: item.discountPercent,
      discount: item.discount,
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/billing-item/${deleteId}`);
      setSnackbar({ open: true, message: 'Item deleted!', severity: 'success' });
      setDeleteId(null);
      fetchItems();
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Item Name', flex: 1, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 180 },
    {
      field: 'category',
      headerName: 'Category',
      width: 140,
      valueGetter: (params) => params.row.category?.name || params.row.category || ''
    },
    { field: 'quantity', headerName: 'Qty', width: 70 },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 110,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: 'taxPercent',
      headerName: 'Tax %',
      width: 80,
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 90,
      renderCell: (params) => `₹${Number(params.value || 0).toFixed(2)}`,
    },
    {
      field: 'discountPercent',
      headerName: 'Discount %',
      width: 100,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 100,
      renderCell: (params) => `₹${Number(params.value || 0).toFixed(2)}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => setDeleteId(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, p: { xs: 1, sm: 2 } }}>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {editId ? 'Update Billing Item' : 'Create Billing Item'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2.4}>
              <TextField
                label="Item Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff', fontWeight: 600 },
                  label: { color: '#fff' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2.4}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                select
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Qty"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={1.2}>
              <TextField
                label="Unit Price"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Tax %"
                name="taxPercent"
                value={form.taxPercent}
                onChange={handleChange}
                type="number"
                fullWidth
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={1.2}>
              <TextField
                label="Tax"
                name="tax"
                value={Number(form.tax || 0).toFixed(2)}
                InputProps={{ readOnly: true }}
                fullWidth
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Discount %"
                name="discountPercent"
                value={form.discountPercent}
                onChange={handleChange}
                type="number"
                fullWidth
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={1.2}>
              <TextField
                label="Discount"
                name="discount"
                value={Number(form.discount || 0).toFixed(2)}
                InputProps={{ readOnly: true }}
                fullWidth
                variant="filled"
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                  input: { color: '#fff' },
                  label: { color: '#fff' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1.2}>
              <Button
                type="submit"
                variant="contained"
                color={editId ? "warning" : "secondary"}
                startIcon={<AddCircleIcon />}
                fullWidth
                sx={{
                  height: 56,
                  fontWeight: 700,
                  fontSize: 16,
                  background: editId
                    ? 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)'
                    : 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
                  color: '#fff',
                  boxShadow: 2,
                  '&:hover': {
                    background: editId
                      ? 'linear-gradient(90deg, #ffd200 0%, #f7971e 100%)'
                      : 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
                  },
                }}
              >
                {editId ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Billing Items
        </Typography>
        <div style={{ width: '100%', minHeight: 350 }}>
          <DataGrid
            rows={items}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={7}
            rowsPerPageOptions={[7, 15, 30]}
            autoHeight
            disableSelectionOnClick
            sx={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 2,
              '& .MuiDataGrid-columnHeaders': {
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
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
          />
        </div>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Item?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this billing item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillingItem;
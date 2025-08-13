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
    Switch
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { createBillingCategory, deleteBillingCategory, fetchBillingCategories, updateBillingCategory } from '../redux/billingCategorySlice';
import { updateBilling } from '../redux/billingSlice';
import { render } from '@testing-library/react';

const BillingCategory = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({id:'', name: '', description: '' });
    const [editId, setEditId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const dispatch = useDispatch();
    const { billingCategory } = useSelector((state) => state.billingCategory);
    // Fetch categories
    useEffect(() => {
        dispatch(fetchBillingCategories()).then(res => {
            if (res.payload) {
                setCategories(res.payload);
            } else {
                console.error('Failed to fetch categories:', res.error);
            }
        });
    }, [dispatch]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                dispatch(updateBillingCategory(form)).then(() => { 
                    dispatch(fetchBillingCategories());
                    setSnackbar({ open: true, message: 'Category updated!', severity: 'success' });
                });
            } else {
                dispatch(createBillingCategory(form)).then(() => {
                    dispatch(fetchBillingCategories());
                    setSnackbar({ open: true, message: 'Category created!', severity: 'success' });
                });
            }
            
            setForm({ name: '', description: '' });
            setEditId(null); 
        } catch (err) {
            setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
        }
    };

    const handleEdit = (category) => {
        setForm({id: category._id, name: category.name, description: category.description });
        setEditId(category._id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const handleDelete = async () => {
        dispatch(deleteBillingCategory(deleteId)).then((res) => {
            if (res.error) {
                setSnackbar({ open: true, message: 'Failed to delete category', severity: 'error' });
                return;
            }
            setSnackbar({ open: true, message: 'Category deleted!', severity: 'success' });
            setDeleteId(null);
            dispatch(fetchBillingCategories());
        }).catch((err) => {         
            setSnackbar({ open: true, message: 'Failed to delete category', severity: 'error' });
        });
    };

    const handleStatusChange = (category) => {
        const updatedCategory = { ...category, id: category?._id, isActive: !category.isActive };
        dispatch(updateBillingCategory(updatedCategory)).then(() => {
            dispatch(fetchBillingCategories());
            setSnackbar({ open: true, message: `Category ${updatedCategory.isActive ? 'activated' : 'deactivated'}!`, severity: 'success' });
        }).catch((err) => {
            setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
        });
    };
    const columns = [
        {
            field: 'name', headerName:'Category Name', flex: 1, minWidth: 180
        },
        {
            field: 'description', headerName:'Description', flex: 2, minWidth: 220
        },
        {
            field: 'isActive', headerName: 'Status', flex: 2, minWidth: 120,
            renderCell: (params) => (
                <Switch
                    checked={params.row.isActive}
                    color={params.row.isActive ? 'success' : 'error'}
                />
            )
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
        <Box sx={{ width: '100%', minHeight: '100vh', background: '#f8fafc', py: { xs: 1, sm: 3 } }}>
            {/* Header Section */}
            <Paper
                elevation={4}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    p: { xs: 2, sm: 3 },
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                    color: '#fff',
                    boxShadow: 6,
                }}
            >
                <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                    🗂️ Manage Billing Categories
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
                        color: '#fff',
                        boxShadow: 2,
                        ml: 'auto',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
                        },
                    }}
                    onClick={() => dispatch(fetchBillingCategories({}))}
                >
                    Refresh
                </Button>
            </Paper>

            {/* Form Section */}
            <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, sm: 2 }, width: '100%' }}>
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
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {editId ? 'Update Billing Category' : 'Create Billing Category'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    label="Category Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    variant="filled"
                                    InputProps={{
                                        style: { background: 'rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontWeight: 600 }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fff' }
                                    }}
                                    sx={{
                                        input: { color: '#fff', fontWeight: 600 },
                                        label: { color: '#fff' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="filled"
                                    InputProps={{
                                        style: { background: 'rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#fff' }
                                    }}
                                    sx={{
                                        input: { color: '#fff' },
                                        label: { color: '#fff' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
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

                {/* Data Table Section */}
                <Paper sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                    background: '#fff',
                    mb: 4,
                }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#185a9d' }}>
                        Billing Categories
                    </Typography>
                    <div style={{ width: '100%', minHeight: 350 }}>
                        <DataGrid
                            rows={billingCategory}
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
                                    // color: '#fff',
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
                    <DialogTitle>Delete Category?</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this billing category? This action cannot be undone.
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
        </Box>
    );
};

export default BillingCategory;
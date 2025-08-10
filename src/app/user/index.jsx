import { Box, Button, Chip, Grid, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../redux/userListSlice";
import { DataGrid } from '@mui/x-data-grid';
import { fetchUserRoles } from "../redux/userRoleSlice";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";
import { updateUser, addUser } from "../redux/updateUserSlice";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const UserFormDialog = ({
    open, handleClose, handleSubmit, form, setForm, roles, isEdit
}) => (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', color: '#fff' }}>
            {isEdit ? "Update Existing User" : "Add New User"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2} sx={{ width: '100%', mt: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="First Name"
                        name="firstname"
                        value={form.firstname}
                        onChange={e => setForm({ ...form, firstname: e.target.value })}
                        fullWidth
                        required
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Last Name"
                        name="lastname"
                        value={form.lastname}
                        onChange={e => setForm({ ...form, lastname: e.target.value })}
                        fullWidth
                        required
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        fullWidth
                        required
                        variant="outlined"
                        type="email"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Mobile"
                        name="mobilenumber"
                        value={form.mobilenumber}
                        onChange={e => setForm({ ...form, mobilenumber: e.target.value })}
                        fullWidth
                        required
                        variant="outlined"
                    />
                </Grid>
                {!isEdit && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            fullWidth
                            required
                            variant="outlined"
                            type="password"
                        />
                        
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            label="Role"
                            value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                            required
                            sx={{ width: '150px' }}
                        >
                            <MenuItem value="">Select Role</MenuItem>
                            {roles && roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>
                                    {role.rolename}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            label="Status"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                            required
                            sx={{ width: '150px' }}
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={9}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="secondary" variant="outlined">Cancel</Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                startIcon={isEdit ? <EditIcon /> : <AddCircleIcon />}
                sx={{
                    fontWeight: 700,
                    background: isEdit
                        ? 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)'
                        : 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                    color: '#fff',
                    boxShadow: 2,
                    '&:hover': {
                        background: isEdit
                            ? 'linear-gradient(90deg, #ffd200 0%, #f7971e 100%)'
                            : 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)',
                    },
                }}
            >
                {isEdit ? "Update" : "Add"}
            </Button>
        </DialogActions>
    </Dialog>
);

const ListAllUsers = () => {
    const { roles } = useSelector((state) => state.userRole);
    const userList = useSelector((state) => state.userList.data);
    const { loading } = useSelector((state) => state.updateUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobilenumber: '',
        password: '',
        role: '',
        status: 1
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(fetchUsersList({}));
        dispatch(fetchUserRoles({}));
    }, [dispatch]);

    const handleOpenForm = () => {
        setForm({
            firstname: '',
            lastname: '',
            email: '',
            mobilenumber: '',
            password: '',
            role: '',
            status: 1
        });
        setIsEdit(false);
        setEditUserId(null);
        setFormDialogOpen(true);
    };

    const handleEditUser = (user) => {
        setForm({
            id: user._id,
            role:
                roles.find((role) => role._id === user.role)?._id ||
                user.role || '', // Use role ID if available, otherwise fallback to role name 
           
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobilenumber: user.mobilenumber,
            password: '', 
            status: user.status === 'Active' || user.status === 1 ? 1 : 9
        });
        setIsEdit(true);
        setEditUserId(user._id);
        setFormDialogOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) { 
                dispatch(updateUser(form)).then((res) => {
                    if (res.error) {
                        setSnackbar({ open: true, message: 'Update failed', severity: 'error' });
                        return;
                    }
                    dispatch(fetchUsersList({}));
                    setForm({
                        firstname: '',
                        lastname: '',
                        email: '',
                        mobilenumber: '',           
                        password: '',
                        role: '',
                        status: 1
                    }); 
                    setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
                    setIsEdit(false);
                    setEditUserId(null);    
                }); 

            }else {
                dispatch(addUser(form)).then((res) => {
                    if (res.error) {
                        setSnackbar({ open: true, message: 'User addition failed', severity: 'error' });
                        return ;
                    }
                    dispatch(fetchUsersList({}));
                    setForm({
                        firstname: '',
                        lastname: '',
                        email: '',          
                        mobilenumber: '',
                        password: '',
                        role: '',
                        status: 1
                    });
                    setSnackbar({ open: true, message: 'User added successfully!', severity: 'success' });
                }); 
            }
             
            setFormDialogOpen(false); 
        } catch {
            setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'mobilenumber', headerName: 'Mobile', width: 140 },
        { field: 'role', headerName: 'Role', width: 100, 
            // valueGetter: (params) => params.row.role?.rolename || params.row.role || 'Unknown' 
        },
        {
            field: 'status', renderCell: (params) =>
            (
                <Chip sx={{ width: 80 }} label={params.value} color={params.value == 'Active' ? 'success' : 'error'} />
            ), headerName: 'Status', width: 120
        },
        {
            field: '',
            renderCell: (e) => (
                <>
                    <Button label="Modify" variant="outlined" color="warning" onClick={() => handleEditUser(e.row)} >Modify</Button>
                    <Button label="Modify" variant="outlined" color={e.row?.status == 'Active' ? 'success' : 'error'} onClick={() => markActive(e)} sx={{ marginLeft: 1 }}>{e.row?.status == 'Active' ? 'InActive' : 'Activate'}</Button>
                </>
            ),
            headerName: 'Modify', width: 280
        },
    ];
    const paginationModel = { pageSize: 5, page: 0 };

    const safeRows = userList.map((row, idx) => ({
        ...row,
        id: row.id ?? idx + 1, // Use existing id or fallback to index
        role: row?.role?.rolename ? row?.role?.rolename : 'Unknown', // Map role ID to role name
        status: row.status == 1 ? 'Active' : 'Inactive', // Map boolean status to string
    }));

    //export user Data to exvcel or csv
    const exportUsers = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            columns.map(col => col.headerName).join(",") + "\n" +
            safeRows.map(row => columns.map(col => row[col.field]).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link); // Clean up
    };
    // Function to handle user modification
    const markActive = (e) => { 
        const user = e.row;
        const newStatus = user.status === 'Active' ? 9 : 1;
        const data = {
            id: user._id, // Use _id if id is not available
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobilenumber: user.mobilenumber,
            role: roles.find(role => role.rolename == user.role)?._id,
            status: newStatus
        }; 
        dispatch(updateUser(data)).then(() => {
            dispatch(fetchUsersList({}));
            setSnackbar({ open: true, message: `User ${newStatus === 1 ? 'activated' : 'deactivated'} successfully!`, severity: 'success' });
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
                <Typography variant="h5" color="textSecondary">
                    List of All Users
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => dispatch(fetchUsersList({}))}>
                    Refresh
                </Button>
                <Button variant="contained" color="secondary" sx={{ marginLeft: '10px' }} onClick={handleOpenForm}>
                    Add User
                </Button>
                <Button variant="contained" color="success" sx={{ marginLeft: '10px' }} onClick={() => exportUsers()}>
                    Export Users
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

            <UserFormDialog
                open={formDialogOpen}
                handleClose={() => setFormDialogOpen(false)}
                handleSubmit={handleFormSubmit}
                form={form}
                setForm={setForm}
                roles={roles}
                isEdit={isEdit}
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar> 
            <Loader open={open} />
        </Box>
    );
}
export default ListAllUsers;
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsersList } from '../redux/userListSlice';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchUserRoles } from '../redux/userRoleSlice';
import { Box, Button, Grid, MenuItem, Paper, Select, TextField, Typography, InputLabel, FormControl } from '@mui/material';
import { checkvalidEmail } from '../../utills';
import { updateUser } from '../redux/updateUserSlice';
import { routesName } from '../constants/routesName';

const ModifyUser = () => {
    const screenwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const { userId } = useParams();
    const userData = useLocation().state?.user || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState(1); // 1 for active, 9 for inactive
    const [errorTxt, setErrorTxt] = useState('');
    const firstNameInput = useRef(null);
    const lastNameInput = useRef(null);
    const mobileInput = useRef(null);
    const emailInput = useRef(null);
    const roleInput = useRef(null);
    const { loading } = useSelector((state) => state.updateUser);
    const { roles } = useSelector((state) => state.userRole);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUsersList({ id: userId }));
            dispatch(fetchUserRoles());
            setFirstName(userData.firstname || '');
            setLastName(userData.lastname || '');
            setEmail(userData.email || '');
            setMobile(userData.mobilenumber || '');
            setRole(userData.role || '');
            setStatus(userData.status || 1);
        }
    }, [userId, dispatch, userData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidEmail = checkvalidEmail(email);

        if (!firstName && !userData.firstname) {
            setErrorTxt('First Name is required');
            firstNameInput.current.focus();
        } else if (!lastName && !userData.lastname) {
            setErrorTxt('Last Name is required');
            lastNameInput.current.focus();
        } else if (!mobile && !userData.mobilenumber) {
            setErrorTxt('Mobile is required');
            mobileInput.current.focus();
        } else if (!email && !userData.email) {
            setErrorTxt('Email is required');
            emailInput.current.focus();
        } else if (!role && !userData.role) {
            setErrorTxt('Role is required');
            roleInput.current.focus();
        } else {
            const data = {
                firstname: firstName ? firstName : userData.firstname,
                lastname: lastName ? lastName : userData.lastname,
                mobilenumber: mobile ? mobile : userData.mobilenumber,
                email: email ? email : userData.email,
                role: role ? role : userData.role,
                status: status ? status : userData.status
            };

            dispatch(updateUser(userId, data))
                .then((response) => {
                    if (response.error) {
                        setErrorTxt(response.error.message);
                    } else if (loading) {
                        setErrorTxt('Please Wait We Are Registering The user...');
                    } else {
                        setErrorTxt('User updated successfully!');
                        setTimeout(() => {
                            navigate(routesName.LIST_ALL_USERS);
                        }, 1200);
                    }
                });
        }
    };

    return (
        <Box sx={{
            width: { xs: '100%', md: (screenwidth - 240) + 'px' },
            mx: 'auto',
            mt: 4,
            p: { xs: 1, sm: 2 }
        }}>
            <Paper sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h5" fontWeight="bold">
                    Update User Details
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
                        color: '#fff',
                        boxShadow: 2,
                        '&:hover': {
                            background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
                        },
                    }}
                    onClick={() => navigate(routesName.LIST_ALL_USERS)}
                >
                    List All Users
                </Button>
            </Paper>
            <Paper sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 2,
                background: 'rgba(255,255,255,0.97)'
            }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                inputRef={firstNameInput}
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="text"
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName ? firstName : userData.firstname}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                inputRef={lastNameInput}
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="text"
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName ? lastName : userData.lastname}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                inputRef={mobileInput}
                                label="Mobile"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="text"
                                onChange={(e) => setMobile(e.target.value)}
                                value={mobile ? mobile : userData.mobilenumber}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                inputRef={emailInput}
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email ? email : userData.email}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    inputRef={roleInput}
                                    labelId="role-label"
                                    label="Role"
                                    variant="outlined"
                                    value={role ? role : userData.role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
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
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    label="Status"
                                    variant="outlined"
                                    value={status ? status : userData.status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={9}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {errorTxt && (
                        <Typography color={errorTxt.includes('success') ? "success.main" : "error"} variant="body2" sx={{ textAlign: 'center', padding: '10px', textTransform: 'capitalize', fontWeight: 600 }}>
                            {errorTxt}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                fontWeight: 700,
                                fontSize: 16,
                                px: 5,
                                py: 1.5,
                                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                                color: '#fff',
                                boxShadow: 2,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)',
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ModifyUser;

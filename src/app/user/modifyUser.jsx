import React, { use, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsersList } from '../redux/userListSlice';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchUserRoles } from '../redux/userRoleSlice';
import { Box, Button, Grid, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { checkvalidEmail, checkvalidPassword } from '../../utills';
import { updateUser } from '../redux/updateUserSlice';
import {routesName} from '../constants/routesName';

const ModifyUser = () => {
    const screenwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const { userId } = useParams();
    const userData = useLocation().state?.user || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState(true); // Assuming true is for active status
    const [errorTxt, setErrorTxt] = useState(''); 
    const firstNameInput = useRef(null);
    const lastNameInput = useRef(null);
    const mobileInput = useRef(null);
    const emailInput = useRef(null); 
    const roleInput = useRef(null);
    const { data, loading, error } = useSelector((state) => state.updateUser);
    const { roles } = useSelector((state) => state.userRole);
    useEffect(() => {
        if (userId) {
            dispatch(fetchUsersList({ id: userId }));
            setFirstName(userData.firstname || '');
            setLastName(userData.lastname || '');
            setEmail(userData.email || '');
            setMobile(userData.mobilenumber || ''); 
        }
    }, [userId, dispatch, userData]);

    const handleModifyUser = () => {
        // Logic to modify the user data
        // console.log('Modifying user:', userData);
        // After modification, you can navigate back or to another page
        navigate('/user-list');
    };
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
            }if (!email && !userData.email) {
                setErrorTxt('Email is required');
                emailInput.current.focus();
            }else if (!role && !userData.role) {
                setErrorTxt('Role is required');
                roleInput.current.focus();
            }else {
                const data={
                    firstname:firstName ? firstName : userData.firstname,
                    lastname:lastName ? lastName : userData.lastname, 
                    mobilenumber:mobile ? mobile : userData.mobilenumber,
                    email : email ? email : userData.email,   
                    role: role ? role : userData.role, // Default role, can be changed as needed
                    status: status ? status : userData.status // Assuming 1 is for active status
                }
                
                dispatch(updateUser(userId, data))
                    .then((response) => {
                        if (response.error) {
                            setErrorTxt(response.error.message);
                        }else if(loading){
                            setErrorTxt('Please Wait We Are Registering The user...');
                        } else {
                            setErrorTxt('Registration Successful'); 
                            // window.location.href = routesName.LIST_ALL_USERS; // Redirect to login page after successful registration
                        }
                    });
            }
        };
    return (
        <Box sx={{ width: (screenwidth - 240) + 'px' }}>
            <Box sx={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
                <Typography variant="h5" color="textSecondary">
                    Update User Details
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginLeft: 'auto' }} onClick={() => window.location.href = '/list-all-users'}>
                    List All Users
                </Button>
            </Box>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                {/* <Typography variant="h6">User Details</Typography> */}
                <Grid container spacing={2}>
                    <form>
                        {/* firstname lastname mobile fields */}
                        <TextField
                            ref={firstNameInput}  
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName ?  firstName : userData.firstname}
                        />
                        <TextField
                            ref={lastNameInput} 
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName ? lastName : userData.lastname}
                        />
                        <TextField
                            ref={mobileInput} 
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="text"
                            onChange={(e) => setMobile(e.target.value)}
                            value={mobile ? mobile : userData.mobilenumber}
                        />
                        <TextField
                            ref={emailInput} 
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email ? email : userData.email}
                        /> 
                        <Select
                            ref={roleInput}
                            label="Role"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={role ? role : userData.role}
                            onChange={(e) => setRole(e.target.value)}
                            sx={{ marginTop: 2 }}
                        >
                            <MenuItem value="">Select Role</MenuItem>
                            {roles && roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>
                                    {role.rolename}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={status ? status : userData.status}       
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{ marginTop: 2 }}
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={9}>Inactive</MenuItem>
                        </Select>
                        {errorTxt && <Typography color="error" variant="body2" sx={{ textAlign: 'center', padding: '10px', textTransform: 'capitalize' }}>{errorTxt}</Typography>}

                    </form>

                </Grid>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
                    Save Changes
                </Button>
            </Paper>
        </Box>
    );
}

export default ModifyUser;

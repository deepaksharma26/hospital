import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../app/redux/registerSlice'; // Assuming you have a registerSlice
import { checkvalidEmail, checkvalidPassword } from '../../../utills';
import { useRef } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [errorTxt, setErrorTxt] = useState('');
    const [eyeOpen, setEyeOpen] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const firstNameInput = useRef(null);
    const lastNameInput = useRef(null);
    const mobileInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null); 
    const confirmPasswordInput = useRef(null); 
    const { data, loading, error } = useSelector((state) => state.register);
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidEmail = checkvalidEmail(email);
        const isValidPassword = checkvalidPassword(password);

        if (!firstName) {
            setErrorTxt('First Name is required');
            firstNameInput.current.focus(); 
        } else if (!lastName) {
            setErrorTxt('Last Name is required');
            lastNameInput.current.focus();
        } else if (!mobile) {
            setErrorTxt('Mobile is required');
            mobileInput.current.focus();    
        }if (!email) {
            setErrorTxt('Email is required');
            emailInput.current.focus();
        }else if(password.length < 8) {
            setErrorTxt('Password must be at least 8 characters long');
            passwordInput.current.focus();
        } else if (!password.match(/[0-9]/) || !password.match(/[\W]/) || !password.match(/[\W_]/)) {
            setErrorTxt('Password must contain at least one number and one special character');
            passwordInput.current.focus();
        } else if (!confirmPassword) {
            setErrorTxt('Confirm Password is required');
            confirmPasswordInput.current.focus();
        }else if (password !== confirmPassword) {
            setErrorTxt('Passwords do not match');
            confirmPasswordInput.current.focus();
        }else if (!isValidEmail) {
            setErrorTxt('Invalid email format');
            emailInput.current.focus();
        }
        // else if (!isValidPassword) {
        //     setErrorTxt('Password must be at least 8 characters long and contain at least one number and one special character');
        // } 
        else {
            const data={
                firstname:firstName,
                lastname:lastName,
                mobilenumber:mobile,
                email,
                password,
                username: email, // Assuming username is the same as email
                createdBy: 'self', // Assuming createdBy is the same as email
                role: 0, // Default role, can be changed as needed
                status: false // Assuming 1 is for active status
            }
            dispatch(registerUser(data))
                .then((response) => {
                    if (response.error) {
                        setErrorTxt(response.error.message);
                    }else if(loading){
                        setErrorTxt('Please Wait We Are Registering The user...');
                    } else {
                        setErrorTxt('Registration Successful');
                        window.location.href = '/login'; // Redirect to login page after successful registration
                    }
                });
        }
    };
    return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>

            <Card sx={{ width: '400px', padding: '20px' }}>
                <img src={require('../../../assets/images/logo.png')} alt="Login" style={{ width: '160px', height: '80px', display: 'block', margin: '0 auto 20px' }} />
                
                <Typography sx={{ textAlign: 'center' }} variant="h5" component="h2" gutterBottom>
                    User Registration
                </Typography>
                <form>
                    {/* firstname lastname mobile fields */}
                    <TextField
                        ref={firstNameInput}
                        label="First Name"
                        color='error'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        ref={lastNameInput}
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        ref={mobileInput}
                        label="Mobile"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="text"
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <TextField
                        ref={emailInput}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        ref={passwordInput}
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={eyeOpen ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => setEyeOpen(!eyeOpen)} variant="text">
                                    {eyeOpen ? 'Hide' : 'Show'}
                                </Button>
                            ),
                        }}
                    />
                    <TextField
                        ref={confirmPasswordInput}
                        label="Confirm Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={eyeOpen ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => setEyeOpen(!eyeOpen)} variant="text">
                                    {eyeOpen ? 'Hide' : 'Show'}
                                </Button>
                            ),
                        }}
                    />
                    {/* Submit button */}
                    <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth type="submit">
                        Register
                    </Button>
                    {errorTxt && <Typography color="error" variant="body2" sx={{ textAlign: 'center', padding: '10px', textTransform: 'capitalize' }}>{errorTxt}</Typography>}

                </form>

                <p style={{ marginTop: '10px' }}>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </Card>
        </Box>
    );
} 
export default Register;
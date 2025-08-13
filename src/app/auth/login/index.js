import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { checkvalidEmail, checkvalidPassword } from '../../../utills';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './../../../app/redux/userSlice';
const Login = () => {    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorTxt, setErrorTxt] = useState('');
    const [eyeOpen, setEyeOpen] = useState(false);
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.users);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const navigate = useNavigate();
  useEffect(() => {
    
  }, [dispatch]);
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        const isValidEmail = checkvalidEmail(email);
        const isValidPassword = checkvalidPassword(password);
        if(!isValidEmail) { 
            emailInput.current.focus();
            setErrorTxt(isValidEmail ? '' : 'Invalid email format'); 
        }
        // else if(!isValidPassword){
        //     passwordInput.current.focus();
        //     setErrorTxt(!isValidPassword ? '' : 'Password must be at least 8 characters long and contain at least one number and one special character');
        // } 
        else { 
            dispatch(fetchUsers({username: email, password: password})).then((res) => {
                if (error) {
                    setErrorTxt('Invalid Email or Password');
                     emailInput.current.focus();
                  }if(loading){
                     setErrorTxt('Please Wait We Are Validating The user...');
                  }else if(res.payload) {
                     setErrorTxt('Login Successful'); 
                     setTimeout(() => {
                        navigate('/dashboard');
                     }, 2000);
                     
                  } else {
                     setErrorTxt('Invalid Email or Password');
                     emailInput.current.focus();
                  } 
            });
            // Simulate a successful login 
            
        }
    };
    return (
       <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <Card sx={{ width: '400px', padding: '20px' }}>
             <img src={require('../../../assets/images/logo.png')} alt="Login" style={{ width: '160px', height: '80px', display: 'block', margin: '0 auto 20px' }} />
             <Typography sx={{textAlign:'center'}} variant="h5" component="h2" gutterBottom>
                User Login
             </Typography>
             <form>
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
                <Typography variant="body2" sx={{ marginTop: '10px', textAlign: 'left', marginBottom: '10px' }}>
                   Forgot your password? <Link to="/change-password">Change Password</Link>
                </Typography>
                <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth type="submit">
                   Login
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', background: 'aliceblue' }}>
                  {loading &&  <CircularProgress color="primary" size={28} /> }
                  {errorTxt && <Typography color={loading ? 'warning' : data ? 'success' : 'error'} variant="body2" sx={{textAlign:'center', padding:'10px', textTransform:'capitalize'}}>{errorTxt}</Typography>}
                </Box>
             </form>
          
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
             Don't have an account? <Link to="/register">Register</Link>
          </Typography>
          </Card> 
       </Box>
    );
}
export default Login;
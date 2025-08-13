import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../redux/changePasswordSlice';
import { Box, Card, Typography, TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [errorTxt, setErrorTxt] = React.useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use useNavigate for programmatic navigation
    const { data, loading, error } = useSelector((state) => state.users);
    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorTxt('All fields are required');
        } else if (newPassword !== confirmPassword) {
            setErrorTxt('New Password and Confirm Password do not match');
        } else if (newPassword.length < 8) {    
            setErrorTxt('New Password must be at least 8 characters long');
        } else {
            // Dispatch change password action
            dispatch(changePassword({ currentPassword, newPassword }));
            if (loading) {
                setErrorTxt('Please wait, we are processing your request...');
            } else if (data) {
                setErrorTxt('Password changed successfully');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setErrorTxt('Error changing password. Please try again.');
            }
        }
    };
    return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <Card sx={{ width: '400px', padding: '20px' }}>
                <img src={require('../../../assets/images/logo.png')} alt="Change Password" style={{ width: '160px', height: '80px', display: 'block', margin: '0 auto 20px' }} />
                <Typography sx={{ textAlign: 'center' }} variant="h5" component="h2" gutterBottom>
                    Change Password
                </Typography>
                <form>
                    <TextField
                        label="Current Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        variant="outlined"
                        fullWidth   
                        margin="normal"
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm New Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}        
                    />
                    <Button onClick={handleChangePassword} variant="contained" color="primary" fullWidth type="submit">
                        Change Password
                    </Button>
                    {errorTxt && <Typography color="error" variant="body2" sx={{ textAlign: 'center', padding: '10px', textTransform: 'capitalize' }}>{errorTxt}</Typography>}
                
                <Typography variant="body2" sx={{ marginTop: '10px', textAlign: 'center' }}>
                    Remembered your password? <Link to="/login">Login</Link>
                </Typography> 
                    {/* Form fields for changing password */}
                </form>
            </Card>
        </Box>
    );
}
export default ChangePassword;
import React, { useEffect, useState, useRef } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LockIcon from '@mui/icons-material/Lock';
import { clearSessionTimeout, getSessionTimeout, getUserIdFromToken, getUsernameFromToken, setSessionTimeout, validatePassword } from '../utills/session';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../app/redux/userSlice';

const IDLE_TIMEOUT = 15 * 60; // 15 minutes in seconds

const Header = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hostIp, setHostIp] = useState('Fetching...');
  const [locked, setLocked] = useState(getSessionTimeout());
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [idleSeconds, setIdleSeconds] = useState(IDLE_TIMEOUT);
  const idleTimer = useRef(null);
  const countdownTimer = useRef(null);
  const { data } = useSelector((state) => state.users);
  const [errorTxt, setErrorTxt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const passwordInput = useRef(null);
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch host IP address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setHostIp(data.ip))
      .catch(() => setHostIp('Unavailable'));
  }, []);

  // Idle timer and countdown logic
  useEffect(() => {
    const resetIdleTimer = () => {
      setIdleSeconds(IDLE_TIMEOUT);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);

      // Start countdown
      countdownTimer.current = setInterval(() => {
        setIdleSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer.current);
            setSessionTimeout(true); // Set session timeout
            setLocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set lock after timeout
      idleTimer.current = setTimeout(() => {
        setLocked(true);
        clearInterval(countdownTimer.current);
      }, IDLE_TIMEOUT * 1000);
    };

    // Reset timer on any user event
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, []);

  // Handle unlock
  const handleUnlock = () => {
    dispatch(fetchUsers({ username: getUserIdFromToken(), password: password })).then((res) => {
      if (error) {
        setErrorTxt('Invalid Email or Password');
        passwordInput.current.focus();
      } if (loading) {
        setErrorTxt('Please Wait We Are Validating The user...');
      } else if (res.payload) {
        setErrorTxt('Login Successful');
        setLocked(false);
        setPassword('');
        setPasswordError(''); 
        setIdleSeconds(IDLE_TIMEOUT);
        clearSessionTimeout()
      } else {
        setErrorTxt('Invalid Email or Password');
        passwordInput.current.focus();
      }
    });
    // Validate password with backend
    // dispatch(fetchUsers({ username: getUserIdFromToken(), password }).then((res) => {
    //   if (res.error) {
    //     setPasswordError('Invalid password');
    //     setPassword('');
    //   } 
    //   // else {
    //   //   setLocked(false);
    //   //   setPassword('');
    //   //   setPasswordError(''); 
    //   //   setIdleSeconds(IDLE_TIMEOUT);
    //   //   // Restart timers
    //   //   if (idleTimer.current) clearTimeout(idleTimer.current);
    //   //   if (countdownTimer.current) clearInterval(countdownTimer.current);
    //   //   // Start again
    //   //   const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    //   //   const resetIdleTimer = () => {
    //   //     setIdleSeconds(IDLE_TIMEOUT);
    //   //     if (idleTimer.current) clearTimeout(idleTimer.current);
    //   //     if (countdownTimer.current) clearInterval(countdownTimer.current);    
    //   //     countdownTimer.current = setInterval(() => {
    //   //       setIdleSeconds(prev => {
    //   //         if (prev <= 1) {
    //   //           clearInterval(countdownTimer.current);
    //   //           setLocked(true);
    //   //           return 0;   
    //   //         }
    //   //         return prev - 1;
    //   //       });
    //   //     }, 1000); 
    //   //     idleTimer.current = setTimeout(() => {
    //   //       setLocked(true);
    //   //       clearInterval(countdownTimer.current);
    //   //     }, IDLE_TIMEOUT * 1000);
    //   //   };
    //   //   events.forEach(event => window.addEventListener(event, resetIdleTimer));
    //   //   resetIdleTimer();
    //   // }
    // }));
  };

  const onLogout = async () => {
    await localStorage.clear();
    navigate('/');
  };

  // Format idle timer as mm:ss
  const formatIdleTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m} min:${s} sec`;
  };

  return (
    <>
      <AppBar color={'inherit'} elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', ml: 30 }}>
          {/* Left: Logo/Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Thakur Eye Hospital
            </Typography>
          </Box>
          {/* Center: Time, IP, Idle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Current Time: {currentTime.toLocaleTimeString()} ||
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#185a9d', fontWeight: 500 }}>
              Your Logged IP Address: {hostIp} ||
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#888', fontWeight: 500 }}>
              Screen Lock-In: {formatIdleTime(idleSeconds)}
            </Typography>
          </Box>
          {/* Right: User, Logout, Fullscreen */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, justifyContent: 'flex-end', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {'Welcome, ' + getUsernameFromToken()}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
              sx={{ ml: 1 }}
            >
              <FullscreenIcon />
            </IconButton>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{ textTransform: 'none', ml: 1 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Lock Screen Dialog */}
      <Dialog open={locked} fullWidth maxWidth="xs" PaperProps={{ sx: { textAlign: 'center', py: 4 } }}>
        <LockIcon sx={{ fontSize: 48, color: '#185a9d', mb: 2 }} />
        <DialogTitle sx={{ fontWeight: 700 }}>Session Locked</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Please enter your password to unlock.</Typography>
          <TextField
            type="password"
            label="Password"
            inputRef={passwordInput}
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleUnlock(); }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleUnlock} color="primary">
            Unlock
          </Button>
          
        </DialogActions>
        {errorTxt && <Typography color={error ? 'error.main' : 'success.main'} variant="body2" sx={{ textAlign: 'center', padding: '10px', textTransform: 'capitalize' }}>{errorTxt}</Typography>}
      </Dialog>
    </>
  );
};

export default Header;
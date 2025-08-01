import React, { use } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, InputBase, Button, Avatar, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useSelector } from 'react-redux';
import { primary } from '../app/constants/color';
import { getUsernameFromToken } from '../utills/session';

const Header = () => { 
  const onLogout = async() =>{
    await localStorage.clear()
    window.location.href = '/login'
  }
  return (
    <AppBar color={'inherit'} elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {/* Search Bar */}
        <Paper
          component="form"
          sx={{
            p: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            width: { xs: 180, sm: 300, md: 400 },
            mx: 2,
            flexGrow: 1,
            maxWidth: 500,
            boxShadow: 'none',
            background: '#f5f6fa',
            marginLeft: '230px'
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton type="submit" sx={{ p: '8px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Logout Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, justifyContent: 'flex-end' }}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {'Welcome, '+getUsernameFromToken() }
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{ textTransform: 'none' }}
          >
            
          </Button>
          <IconButton
            color="inherit"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            sx={{ ml: 2 }}
          >
            <FullscreenIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
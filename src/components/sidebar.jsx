import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, Typography, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate, useLocation } from 'react-router-dom';
import { routesName } from '../app/constants/routesName';

const drawerWidth = 220;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: routesName.DASHBOARD, color: '#43cea2' },
  { label: 'Users', icon: <PeopleIcon />, path: routesName.LIST_ALL_USERS, color: '#ff9966' },
  { label: 'Billing', icon: <ReceiptIcon />, path: routesName.BILLING, color: '#f7971e' },
  { label: 'Billing Item', icon: <CategoryIcon />, path: routesName.BILLING_ITEM, color: '#b91d73' },
  { label: 'Billing Category', icon: <CategoryIcon />, path: routesName.BILLING_CATEGORY, color: '#11998e' },
  { label: 'Financial Year', icon: <CalendarMonthIcon />, path: routesName.FINANCIALYEAR, color: '#185a9d' },
  // { label: 'Reports', icon: <AssessmentIcon />, path: '/report/sales', color: '#00C49F' },
  { label: 'Logout', icon: <LogoutIcon />, path: '/logout', logout: true, color: '#ff5e62' },
];

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const handleMenuClick = (item) => {
    if (item.logout) {
      onLogout();
    } else {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{
      width: { xs: 70, sm: drawerWidth },
      flexShrink: 0,
      top: 0,
      left: 0,
      marginTop: { xs: 0, sm: '64px' },
      background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      boxShadow: 4,
      position: 'fixed',
      zIndex: 1200,
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Drawer
        variant="permanent"
        sx={{
          width: { xs: 70, sm: drawerWidth },
          flexShrink: 0,
          top: 0,
          position: 'relative',
          [`& .MuiDrawer-paper`]: {
            width: { xs: 70, sm: drawerWidth },
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRight: 'none',
            boxShadow: 4,
            overflow: 'hidden', // Hide scrollbars
          },
          display: { xs: 'block', sm: 'block' },
        }}
      >
        <Box sx={{
          marginTop: '10px',
          marginLeft: { xs: 'auto', sm: '30px' },
          alignItems: 'center',
          minWidth: 60,
          height: '50px',
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <img
            src={require('../assets/images/logo.png')}
            alt="User Icon"
            style={{
              width: 48,
              height: 48,
              filter: 'drop-shadow(0 2px 8px #43cea2)',
              display: 'block'
            }}
          />
        </Box>
        <Toolbar sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Box
          sx={{
            overflow: 'hidden', // Hide scrollbars
            marginTop: { xs: 0, sm: '-62px' },
            width: '100%',
          }}
        >
          <Box sx={{ height: '2px', borderBottom: '1px solid #CECECE', width: '100%', }}></Box>
          <List sx={{ p: 0 }}>
            {menuItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <Tooltip title={item.label} placement="right" arrow>
                  <ListItem
                    button
                    onClick={() => handleMenuClick(item)}
                    selected={location.pathname === item.path}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                    sx={{
                      position: 'relative',
                      color: location.pathname === item.path ? '#fff' : 'text.primary',
                      background: location.pathname === item.path
                        ? `linear-gradient(90deg, ${item.color} 0%, #185a9d 100%)`
                        : hovered === idx
                          ? 'rgba(67,206,162,0.08)'
                          : 'transparent',
                      padding: { xs: '10px 8px', sm: '12px 24px' },
                      margin: { xs: '4px 0', sm: '6px 0' },
                      borderRadius: 2,
                      boxShadow: location.pathname === item.path ? 3 : 0,
                      transition: 'all 0.2s',
                      minWidth: 0,
                      cursor: 'pointer',
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                      '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 0 2px rgba(67,206,162,0.5)',
                      },
                      '&:focus-visible': {
                        boxShadow: '0 0 0 2px rgba(67,206,162,0.5)',
                      },
                      '&:active, &:hover': {
                        background: location.pathname === item.path
                          ? `linear-gradient(90deg, ${item.color} 0%, #185a9d 100%)`
                          : hovered === idx
                            ? 'rgba(67,206,162,0.08)'
                            : 'transparent',
                        color: location.pathname === item.path || hovered === idx ? '#fff' : 'text.primary',
                      },
                      '&:focus, &:hover': {
                        background: location.pathname === item.path
                          ? `linear-gradient(90deg, ${item.color} 0%, #185a9d 100%)`
                          : hovered === idx
                            ? 'rgba(67,206,162,0.08)'
                            : 'transparent',
                        color: location.pathname === item.path || hovered === idx ? '#fff' : 'text.primary',
                      },
                      '&:active, &:focus, &:hover': {
                        boxShadow: location.pathname === item.path || hovered === idx ? 2 : 0,
                        transform: location.pathname === item.path || hovered === idx ? 'scale(1.03)' : 'none',
                      },  
                      '&:hover': {
                        background: `linear-gradient(90deg, ${item.color} 0%, #185a9d 100%)`,
                        color: '#fff',
                        boxShadow: 2,
                        transform: 'scale(1.03)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{
                      color: location.pathname === item.path || hovered === idx ? item.color : '#888',
                      minWidth: 0,
                      mr: { xs: 0, sm: 2 },
                      justifyContent: 'center',
                      fontSize: 24,
                      filter: location.pathname === item.path || hovered === idx
                        ? 'drop-shadow(0 2px 8px #43cea2)'
                        : 'none',
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{
                          fontWeight: 700,
                          fontSize: 16,
                          letterSpacing: 0.5,
                          color: location.pathname === item.path || hovered === idx ? '#fff' : '#222',
                          textShadow: location.pathname === item.path || hovered === idx
                            ? '0 2px 8px #43cea2'
                            : 'none',
                          transition: 'color 0.2s',
                          display: { xs: 'none', sm: 'block' }
                        }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Tooltip>
                {/* <Box sx={{
                  height: '1px',
                  borderBottom: '1px solid #E0E0E0',
                  width: { xs: '60%', sm: '80%' },
                  margin: '0 auto',
                  display: { xs: 'none', sm: 'block' }
                }}></Box> */}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
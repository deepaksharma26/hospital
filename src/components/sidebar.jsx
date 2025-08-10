import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { routesName } from '../app/constants/routesName';

const drawerWidth = 220;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: routesName.DASHBOARD },
  { label: 'Users', icon: <PeopleIcon />, path: routesName.LIST_ALL_USERS },
  { label: 'Billing', icon: <AccountCircleIcon />, path: routesName.BILLING },
  { label: 'Billing Item', icon: <AccountCircleIcon />, path: routesName.BILLING_ITEM },
  { label: 'Billing Category', icon: <AccountCircleIcon />, path: routesName.BILLING_CATEGORY },
  { label: 'Financial Year', icon: <AccountCircleIcon />, path: routesName.FINANCIALYEAR },
  { label: 'Logout', icon: <LogoutIcon />, path: '/logout', logout: true },
];

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const handleMenuClick = (item) => {
    if (item.logout && onLogout) {
      onLogout();
    } else {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{ width: drawerWidth, flexShrink: 0, top: 0, left: 0, marginTop: '64px' }}>
      <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth, 
        flexShrink: 0, 
        top: 0,
        position: 'relative', 
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        display: { xs: 'none', sm: 'block' },
      }}
    >
       <Box sx={{marginTop: '10px', marginLeft:'30px', alignItems: 'center', minWidth: 120, height: '50px'}}>
           
            <img src={require('../assets/images/logo.png')} alt="User Icon" style={{ width: 124, height: 48 }} />
         
       </Box>
      <Toolbar />
      <Box sx={{ overflow: 'auto', marginTop: '-62px' }}>
        <Box sx={{height:'2px', borderBottom: '1px solid #CECECE', width:'100%'}}></Box>
        <List>
          {menuItems.map((item) => (
            <>
            <ListItem
              button
              key={item.label}
              onClick={() => handleMenuClick(item)}
              sx={{ 
                '&:hover': { backgroundColor: '#F0F8FF' }, 
                color: 'text.primary', 
                padding: '10px 20px',
                cursor: 'pointer', 
                '&.Mui-selected': { backgroundColor: '#E0E0E0', color: 'text.primary'}
              } }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{fontSize:16, fontWeight:800}}/>
            </ListItem>
            <Box sx={{height:'1px', borderBottom: '1px solid #CECECE', width:'100%'}}></Box>
            </>
          ))}
        </List>
      </Box>
    </Drawer>
    </Box>
    
  );
};

export default Sidebar;
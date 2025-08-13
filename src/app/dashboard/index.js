import { Box, Grid } from "@mui/material";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { useEffect } from "react";
import { isTokenExpired } from "../../utills/session";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isTokenExpired()) {
      navigate('/');
    }
  }, []);
  const onLogout = async() =>{
    await localStorage.clear()
    navigate('/')
  }
  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        minHeight: '100vh',
        pt: { xs: 0, sm: '64px' }
      }}>
        {/* Sidebar */}
        <Box  
          sx={{
            width: { xs: 70, sm: 220 },
            flexShrink: 0,
            bgcolor: '#f0f0f0',
            minHeight: { xs: 'auto', sm: '100vh' },
            zIndex: 1200,
            position: { xs: 'relative', sm: 'fixed' },
            top: { xs: 0, sm: 64 },
            left: 0,
            boxShadow: { sm: 4 },
          }}
        >
          <Sidebar onLogout={onLogout} />
        </Box>
        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, sm: '220px' },
            mt: { xs: '30px', sm: '30px' },
            p: { xs: 1.5, sm: 3 },
            minHeight: 'calc(100vh - 64px)',
            transition: 'margin 0.2s',
            width: { xs: '100%', sm: 'calc(100% - 220px)' },
            background: '#f8fafc',
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: { xs: 0, sm: 2 }
          }}
        >
          {element}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
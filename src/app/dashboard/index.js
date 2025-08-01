import { Box, Grid } from "@mui/material";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { useEffect } from "react";
import { isTokenExpired } from "../../utills/session";

const Dashboard = ({ element }) => {
  useEffect(() => {
    // Any initialization logic can go here
     if(isTokenExpired()) {
      window.location.href = '/login';
    }
  }, []);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Box sx={{ width: '100%', flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}
          >
            <Grid item sx={{ backgroundColor: '#f0f0f0', height: '100vh', marginTop: '64px' }}>
              <Sidebar />
            </Grid>
            <Grid item sx={{ marginTop: '66px', marginLeft:'10px' }}>
              {element}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Dashboard;
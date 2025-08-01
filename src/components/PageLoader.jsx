import React from 'react';
import { Box, Card, CircularProgress, Grid, Typography } from '@mui/material';

const PageLoader = () => {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        marginTop: '64px',
        justifyContent: 'center',
        background: '#f5f6fa',
      }}
    >
      <Card
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 400,
          minHeight:300
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <img src={require('../assets/images/eye-blink.gif')} alt="Loading..." style={{ width: '160px', height: '100px' }} />
        </Grid>
        <CircularProgress color="primary" size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Please wait while we load the page...
        </Typography>
      </Card>
    </Box>
  );
};
export default PageLoader;
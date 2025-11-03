import React from 'react';
import { Container, Typography } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Admin Dashboard
      </Typography>
      <Typography>
        Welcome, Admin. This is where you can manage users and recipes.
      </Typography>
    </Container>
  );
};

export default AdminDashboard;
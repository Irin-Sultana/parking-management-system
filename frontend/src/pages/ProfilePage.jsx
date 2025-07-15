import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUser(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching profile:', err);
      setLoading(false);
    });
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      {loading ? (
        <CircularProgress />
      ) : user ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Name: {user.name}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone || '—'}</Typography>
          <Typography>Vehicle No: {user.vehicleNo || '—'}</Typography>
        </Paper>
      ) : (
        <Typography color="error">No profile data found.</Typography>
      )}
    </Container>
  );
};

export default ProfilePage;
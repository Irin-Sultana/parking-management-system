import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Grid,
  Paper,
  Stack,
  IconButton,
  Badge,
  Button
} from '@mui/material';
import {
  LocalParking as ParkingIcon,
  Receipt as ReceiptIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  AccountCircle as ProfileIcon,
  DirectionsCar as CarIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%'
}));

const ClientDashboard = () => {
  
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get('/auth/profile')
      .then(res => setUser(res.data))
      .catch(err => console.error('Failed to fetch user:', err));
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Mock data
  const quickActions = [
    { label: 'Park Vehicle', icon: <ParkingIcon fontSize="large" />, color: 'primary' },
    { label: 'View History', icon: <HistoryIcon fontSize="large" />, color: 'secondary' },
    { label: 'Make Payment', icon: <ReceiptIcon fontSize="large" />, color: 'success' },
    { label: 'Get Help', icon: <HelpIcon fontSize="large" />, color: 'warning' },
  ];

  const recentActivity = [
    { time: '10:30 AM', action: 'Parked at Spot A-12', duration: '2h 15m', cost: '$4.50' },
    { time: 'Yesterday', action: 'Monthly pass renewed', duration: '', cost: '$75.00' },
    { time: '2 days ago', action: 'Parked at Spot B-05', duration: '1h 30m', cost: '$3.00' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Parking Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <ProfileIcon /> 
            </IconButton>
              <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
                <LogoutIcon />
              </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2 }} src="/user-avatar.jpg" />
          <Box>
            <Typography variant="h5">
              {user ? `Welcome back, ${user.name}!` : 'Welcome!'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last parked: Spot A-12 (Today 10:30 AM)
            </Typography>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Button
                fullWidth
                variant="contained"
                color={action.color}
                sx={{ py: 4, borderRadius: 2 }}
              >
                <Stack spacing={1} alignItems="center">
                  {action.icon}
                  <Typography variant="body2">{action.label}</Typography>
                </Stack>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Current Vehicle Status */}
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Item elevation={4}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <CarIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Current Parking</Typography>
              </Stack>
              <Box sx={{ textAlign: 'left', pl: 4 }}>
                <Typography><strong>Spot:</strong> A-12 (Level 1)</Typography>
                <Typography><strong>Entry Time:</strong> Today 10:30 AM</Typography>
                <Typography><strong>Duration:</strong> 2h 15m</Typography>
                <Typography><strong>Estimated Cost:</strong> $4.50</Typography>
              </Box>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={() => console.log('Extend parking')}
              >
                Extend Parking
              </Button>
            </Item>
          </Grid>

          {/* Recent Activity */}
          <Grid xs={12} md={6}>
            <Item elevation={4}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Stack spacing={2}>
                {recentActivity.map((activity, index) => (
                  <Paper key={index} sx={{ p: 2, textAlign: 'left' }}>
                    <Typography variant="subtitle2">{activity.time}</Typography>
                    <Typography>{activity.action}</Typography>
                    {activity.duration && (
                      <Typography variant="caption">
                        {activity.duration} • {activity.cost}
                      </Typography>
                    )}
                    {!activity.duration && (
                      <Typography variant="caption">{activity.cost}</Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Item>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Parking System © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ClientDashboard;
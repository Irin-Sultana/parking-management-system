import React from 'react';
import { 
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Avatar,
  Container,
  Grid,
  Paper,
  Stack,
  IconButton
} from '@mui/material';

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalParking as ParkingIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius * 2,
}));

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mock data
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <PeopleIcon color="primary" /> },
    { title: 'Parking Spaces', value: '56', icon: <ParkingIcon color="secondary" /> },
    { title: 'Today Revenue', value: '$2,340', icon: <ReceiptIcon color="success" /> },
    { title: 'Occupancy Rate', value: '78%', icon: <DashboardIcon color="warning" /> },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar sx={{ width: 56, height: 56, mr: 2 }} src="/admin-avatar.jpg" />
        <Box>
          <Typography variant="subtitle1">Admin User</Typography>
          <Typography variant="caption">admin@example.com</Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {['Dashboard', 'Users', 'Parking', 'Billing', 'Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
            <ListItemIcon>
              {index === 0 && <DashboardIcon />}
              {index === 1 && <PeopleIcon />}
              {index === 2 && <ParkingIcon />}
              {index === 3 && <ReceiptIcon />}
              {index === 4 && <SettingsIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
           </ListItemButton> 
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            {stats.map((stat, index) => (
              <Grid xs={12} sm={6} md={3} lg={3} xl={2.4} key={index}>
                <Item elevation={4}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ fontSize: 40 }}>{stat.icon}</Box>
                    <Box>
                      <Typography variant="h6">{stat.value}</Typography>
                      <Typography variant="caption">{stat.title}</Typography>
                    </Box>
                  </Stack>
                </Item>
              </Grid>
            ))}

            {/* Recent Users */}
            <Grid xs={12} md={8}>
              <Item elevation={4} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Users
                </Typography>
              </Item>
            </Grid>

            {/* Parking Status */}
            <Grid xs={12} md={4}>
              <Item elevation={4} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Parking Status
                </Typography>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
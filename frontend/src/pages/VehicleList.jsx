import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Typography, Paper, Stack, Button } from '@mui/material';

const VehicleList = () => {
const [vehicles, setVehicles] = useState([]);

useEffect(() => {
axios.get('/vehicles').then(res => setVehicles(res.data));
}, []);

const handleDelete = (id) => {
axios.delete(`/vehicles/${id}`).then(() => {
    setVehicles(prev => prev.filter(v => v._id !== id));
});
};

return (
<Stack spacing={2}>
    <Typography variant="h5">My Vehicles</Typography>
    {vehicles.map(v => (
    <Paper key={v._id} sx={{ p: 2 }}>
        <Typography>Plate: {v.plateNumber}</Typography>
        <Typography>Type: {v.type}</Typography>
        <Button onClick={() => handleDelete(v._id)}>Delete</Button>
    </Paper>
    ))}
</Stack>
);
};

export default VehicleList;
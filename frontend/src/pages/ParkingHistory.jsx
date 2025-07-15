import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Typography, Paper, Stack, Container } from '@mui/material';

const ParkingHistory = () => {
  const [completedSessions, setCompletedSessions] = useState([]);

  useEffect(() => {
    axios.get('/parking-sessions/my')
      .then(res => {
        const history = res.data.filter(session => session.status === 'COMPLETED');
        setCompletedSessions(history);
      })
      .catch(err => console.error('Error fetching history:', err));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Parking History</Typography>
      <Stack spacing={2}>
        {completedSessions.length === 0 && (
          <Typography>No parking history found.</Typography>
        )}
        {completedSessions.map((session) => (
          <Paper key={session._id} sx={{ p: 2 }}>
            <Typography><strong>Spot:</strong> {session.parkingSlot?.slotId}</Typography>
            <Typography><strong>Entry:</strong> {new Date(session.entryTime).toLocaleString()}</Typography>
            <Typography><strong>Exit:</strong> {new Date(session.actualExitTime).toLocaleString()}</Typography>
            <Typography><strong>Duration:</strong> {session.durationHours} hours</Typography>
            <Typography><strong>Cost:</strong> ${session.durationHours * session.parkingSlot?.pricePerHour}</Typography>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default ParkingHistory;
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const PaymentPage = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const spotId = query.get('spotId');
  const rate = Number(query.get('rate'));
  const duration = Number(query.get('duration'));
  const cost = Number(query.get('cost'));

  const handlePayment = () => {
  const bookedUntil = new Date(Date.now() + duration * 60 * 60 * 1000);
  localStorage.setItem(`booking_${spotId}`, bookedUntil.toISOString());

  const invoiceId = `INV-${spotId}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;

  navigate('/', {
    state: {
      confirmed: true,
      invoice: {
        invoiceId,
        slotId: spotId,
        rate,
        duration,
        amount: cost.toFixed(2),
        bookedUntil: bookedUntil.toISOString(),
        issuedAt: new Date().toISOString()
      }
    }
  });
};

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>Payment for Spot {spotId}</Typography>
      <Typography variant="body1">Rate: ${rate}/hr</Typography>
      <Typography variant="body1">Duration: {duration} hour(s)</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Total: ${cost.toFixed(2)}</Typography>
      <Button variant="contained" onClick={handlePayment}>Confirm Payment</Button>
    </Container>
  );
};

export default PaymentPage;
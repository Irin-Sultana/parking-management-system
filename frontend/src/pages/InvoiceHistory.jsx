import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Paper, Typography, Stack } from '@mui/material';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get('/invoices/my').then(res => setInvoices(res.data));
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Payment History</Typography>
      {invoices.map(inv => (
        <Paper key={inv._id} sx={{ p: 2 }}>
          <Typography>Amount: ${inv.amount}</Typography>
          <Typography>Status: {inv.paymentStatus?.status}</Typography>
          <Typography>Date: {new Date(inv.createdAt).toLocaleString()}</Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default InvoiceHistory;
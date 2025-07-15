import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Box, Button, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const initialSpots = [
  { id: 'A1', status: 'free', rate: 2.5, bookedUntil: null },
  { id: 'A2', status: 'booked', rate: 3.0, bookedUntil: new Date(Date.now() + 1000 * 60 * 45) },
  { id: 'A3', status: 'booked', rate: 2.0, bookedUntil: new Date(Date.now() + 1000 * 60 * 10) },
  { id: 'B1', status: 'free', rate: 2.5, bookedUntil: null },
  { id: 'B2', status: 'free', rate: 3.5, bookedUntil: null }
];

const ParkingSlotSearch = () => {
  const [spots, setSpots] = useState(initialSpots);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const navigate = useNavigate();

  const downloadPDF = () => {
  const doc = new jsPDF();
  doc.text('🧾 Parking Invoice', 20, 20);
  doc.text(`Invoice ID: ${invoice.invoiceId}`, 20, 30);
  doc.text(`Spot: ${invoice.slotId}`, 20, 40);
  doc.text(`Rate: $${invoice.rate}`, 20, 50);
  doc.text(`Duration: ${invoice.duration} hr(s)`, 20, 60);
  doc.text(`Total: $${invoice.amount}`, 20, 70);
  doc.text(`Booked Until: ${new Date(invoice.bookedUntil).toLocaleString()}`, 20, 80);
  doc.save(`Invoice-${invoice.invoiceId}.pdf`);
};


  const location = useLocation();
  const confirmed = location.state?.confirmed;
  const invoice = location.state?.invoice;

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (confirmed && invoice) {
      toast.success('Booking successful!');
      setShowInvoiceModal(true);

      // Update UI slot
      setSpots(prev =>
        prev.map(s =>
          s.id === invoice.slotId
            ? { ...s, status: 'booked', bookedUntil: new Date(invoice.bookedUntil) }
            : s
        )
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prev =>
        prev.map(spot => {
          const stored = localStorage.getItem(`booking_${spot.id}`);
          if (stored) {
            const bookedUntil = new Date(stored);
            if (bookedUntil > new Date()) {
              return { ...spot, status: 'booked', bookedUntil };
            } else {
              localStorage.removeItem(`booking_${spot.id}`);
              return { ...spot, status: 'free', bookedUntil: null };
            }
          }
          return spot;
        })
      );
      }, 1000);
    }, []);


  const formatTimeLeft = (until) => {
    const diff = Math.max(0, until - new Date());
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s left`;
  };

  const redirectToPayment = () => {
    const cost = selectedSpot.rate * duration;
    navigate(`/payment?spotId=${selectedSpot.id}&rate=${selectedSpot.rate}&duration=${duration}&cost=${cost}`);
    setOpen(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Parking Dashboard</Typography>

      <Grid container spacing={2}>
        {spots.map((spot) => (
          <Grid item xs={6} sm={4} key={spot.id}>
            <Box sx={{
              p: 2, borderRadius: 2, textAlign: 'center',
              backgroundColor: spot.status === 'free' ? '#c8e6c9' : '#ffcdd2',
              border: '2px solid',
              borderColor: spot.status === 'free' ? '#388e3c' : '#c62828'
            }}>
              <Typography variant="h6">{spot.id}</Typography>
              <Typography>Rate: ${spot.rate}/hr</Typography>
              {spot.status === 'free' ? (
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setSelectedSpot(spot);
                    setOpen(true);
                  }}
                >
                  Book Now
                </Button>
              ) : (
                <Typography sx={{ mt: 1 }}>Booked — {formatTimeLeft(spot.bookedUntil)}</Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Book {selectedSpot?.id}</DialogTitle>
        <DialogContent>
          <TextField
            label="Duration (hours)"
            type="number"
            fullWidth
            value={duration}
            inputProps={{ min: 1 }}
            onChange={(e) => setDuration(Number(e.target.value))}
            sx={{ mt: 2 }}
          />
          <Typography sx={{ mt: 2 }}>
            Estimated: ${selectedSpot ? (selectedSpot.rate * duration).toFixed(2) : '0.00'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={redirectToPayment}>Continue to Payment</Button>
        </DialogActions>
      </Dialog>
      {/* Booking Confirmation Modal */}
      <Dialog open={showInvoiceModal} onClose={() => setShowInvoiceModal(false)}>
        <DialogTitle>🎉 Booking Confirmed</DialogTitle>
        <DialogContent>
          <Typography>Invoice ID: {invoice?.invoiceId}</Typography>
          <Typography>Spot: {invoice?.slotId}</Typography>
          <Typography>Duration: {invoice?.duration} hr(s)</Typography>
          <Typography>Rate: ${invoice?.rate}</Typography>
          <Typography>Total: ${invoice?.amount}</Typography>
          <Typography>Booked Until: {new Date(invoice?.bookedUntil).toLocaleTimeString()}</Typography>
          <Button variant="outlined" onClick={downloadPDF}>Download Receipt</Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ParkingSlotSearch;
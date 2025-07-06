const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock parking slots
let parkingSlots = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  isOccupied: false,
  vehicle: null,
}));

// GET all parking slots
app.get('/api/parking', (req, res) => {
  res.json(parkingSlots);
});

// POST to park a vehicle
app.post('/api/parking/park', (req, res) => {
  const { vehicleId } = req.body;
  const availableSlot = parkingSlots.find(slot => !slot.isOccupied);

  if (!availableSlot) {
    return res.status(400).json({ error: 'No available slots' });
  }

  availableSlot.isOccupied = true;
  availableSlot.vehicle = vehicleId;

  res.json({ slot: availableSlot });
});

// POST to unpark a vehicle
app.post('/api/parking/unpark/:id', (req, res) => {
  const slotId = parseInt(req.params.id);
  const slot = parkingSlots.find(s => s.id === slotId);

  if (!slot || !slot.isOccupied) {
    return res.status(400).json({ error: 'Slot is already free or invalid' });
  }

  slot.isOccupied = false;
  slot.vehicle = null;

  res.json({ message: `Slot ${slotId} is now free` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚗 Parking server running on http://localhost:${PORT}`);
});
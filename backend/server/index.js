const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);

// Mock parking slots
let parkingSlots = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  isOccupied: false,
  vehicle: null,
}));

// GET all parking slots
app.get("/api/parking", (req, res) => {
  res.json(parkingSlots);
});

// POST to park a vehicle
app.post("/api/parking/park", (req, res) => {
  const { vehicleId } = req.body;
  const availableSlot = parkingSlots.find((slot) => !slot.isOccupied);

  if (!availableSlot) {
    return res.status(400).json({ error: "No available slots" });
  }

  availableSlot.isOccupied = true;
  availableSlot.vehicle = vehicleId;

  res.json({ slot: availableSlot });
});

// POST to unpark a vehicle
app.post("/api/parking/unpark/:id", (req, res) => {
  const slotId = parseInt(req.params.id);
  const slot = parkingSlots.find((s) => s.id === slotId);

  if (!slot || !slot.isOccupied) {
    return res.status(400).json({ error: "Slot is already free or invalid" });
  }

  slot.isOccupied = false;
  slot.vehicle = null;

  res.json({ message: `Slot ${slotId} is now free` });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Parking server running on port ${PORT}`);
});

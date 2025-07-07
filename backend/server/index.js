const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config();

const authRoutes = require("./routes/auth");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Parking server running on port ${PORT}`);
});

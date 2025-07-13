const ParkingZone = require("../models/ParkingZone");

const getParkingZones = async (req, res) => {
  try {
    const zones = await ParkingZone.find({});
    res.json(zones);
  } catch (error) {
    console.error("Error fetching parking zones:", error);
    res.status(500).json({ message: "Server error fetching parking zones." });
  }
};

const getParkingZoneById = async (req, res) => {
  try {
    const zone = await ParkingZone.findById(req.params.id);
    if (zone) {
      res.json(zone);
    } else {
      res.status(404).json({ message: "Parking Zone not found." });
    }
  } catch (error) {
    console.error("Error fetching parking zone by ID:", error);
    res
      .status(500)
      .json({ message: "Server error fetching parking zone details." });
  }
};

module.exports = {
  getParkingZones,
  getParkingZoneById,
};

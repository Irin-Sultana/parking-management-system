const ParkingZone = require("../models/ParkingZone");
const ParkingSlot = require("../models/ParkingSlot");
const ParkingSession = require("../models/ParkingSession");

const createParkingSlot = async (req, res) => {
  const { slotId, slotType, pricePerHour, parkingZoneId } = req.body;
  if (!slotId || !slotType || !pricePerHour || !parkingZoneId) {
    return res.status(400).json({
      message:
        "Please include slot ID, type, price per hour, and parking zone ID.",
    });
  }
  if (!["COMPACT", "REGULAR", "LARGE"].includes(slotType.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid slot type. Must be COMPACT, REGULAR, or LARGE.",
    });
  }
  if (isNaN(pricePerHour) || pricePerHour < 0) {
    return res
      .status(400)
      .json({ message: "Price per hour must be a non-negative number." });
  }
  const slotExists = await ParkingSlot.findOne({ slotId });
  if (slotExists) {
    return res
      .status(400)
      .json({ message: "Parking Slot with this ID already exists." });
  }
  const zoneExists = await ParkingZone.findById(parkingZoneId);
  if (!zoneExists) {
    return res
      .status(404)
      .json({ message: "Associated Parking Zone not found." });
  }
  try {
    const parkingSlot = await ParkingSlot.create({
      slotId,
      slotType: slotType.toUpperCase(),
      pricePerHour,
      parkingZone: parkingZoneId,
      status: "AVAILABLE",
      isAvailable: true,
    });
    await Log.create({
      action: "Parking Slot Created",
      userId: req.user._id,
      details: {
        slotId: parkingSlot.slotId,
        zoneId: parkingSlot.parkingZone.toString(),
        type: parkingSlot.slotType,
      },
    });
    res.status(201).json(parkingSlot);
  } catch (error) {
    console.error("Error creating parking slot:", error);
    res.status(500).json({ message: "Server error during slot creation." });
  }
};

modules.export = {
  createParkingSlot,
  isSlotAvailableForBooking,
};

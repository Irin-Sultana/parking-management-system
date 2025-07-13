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

// Helper function to determine if a slot is truly available for a given time range
const isSlotAvailableForBooking = async (
  slotId,
  requestedStartTime,
  requestedEndTime
) => {
  // 1. Check current status of the slot
  const slot = await ParkingSlot.findById(slotId);
  if (!slot || slot.status === "OCCUPIED" || !slot.isAvailable) {
    return false;
  }

  // 2. Check for overlapping 'RESERVED' or 'ACTIVE' sessions
  const overlappingSessions = await EntryVehicleExit.find({
    parkingSlot: slotId,
    status: { $in: ["RESERVED", "ACTIVE"] },
    $or: [
      // Session starts during the requested interval
      {
        entryTime: { $lt: requestedEndTime },
        exitTime: { $gt: requestedStartTime },
      },
      // Session ends during the requested interval
      {
        entryTime: { $lt: requestedEndTime },
        exitTime: { $gt: requestedStartTime },
      },
      // Requested interval is fully within a session
      {
        entryTime: { $lte: requestedStartTime },
        exitTime: { $gte: requestedEndTime },
      },
    ],
  });

  return overlappingSessions.length === 0;
};

// @desc    Search for available parking slots
// @route   GET /api/parking-slots/search?location=<address>&date=<YYYY-MM-DD>&arrivalTime=<HH:MM>&exitTime=<HH:MM>&slotType=<TYPE>&latitude=<lat>&longitude=<lng>&radiusKm=<km>
// @access  Public
const searchParkingSlots = async (req, res) => {
  const {
    location,
    date,
    arrivalTime,
    exitTime,
    slotType,
    latitude,
    longitude,
    radiusKm = 10,
  } = req.query; // Default radius 10km

  if (!date || !arrivalTime || !exitTime) {
    return res.status(400).json({
      message: "Date, arrival time, and exit time are required for search.",
    });
  }

  let targetLatitude, targetLongitude;

  if (latitude && longitude) {
    targetLatitude = parseFloat(latitude);
    targetLongitude = parseFloat(longitude);
    if (isNaN(targetLatitude) || isNaN(targetLongitude)) {
      return res
        .status(400)
        .json({ message: "Invalid latitude or longitude provided." });
    }
  } else if (location) {
    // **IMPORTANT**: In future, we will implement a geocoding API call here
    // to convert 'location' string (e.g., "Memorial University") into lat/lng.
    // For this small scale project, let's use a simplified lookup for common terms or a default.
    // Example: Using a known point for St. John's, NL if no specific lat/lng given.
    if (
      location.toLowerCase().includes("memorial university") ||
      location.toLowerCase().includes("mun")
    ) {
      targetLatitude = 47.575; // Approx. center of MUN St. John's campus
      targetLongitude = -52.73;
    } else if (
      location.toLowerCase().includes("st. john's") ||
      location.toLowerCase().includes("st. johns")
    ) {
      targetLatitude = 47.5615;
      targetLongitude = -52.7126;
    } else {
      return res.status(400).json({
        message:
          'Could not resolve location to coordinates. Please provide specific latitude/longitude or a known campus name like "Memorial University".',
      });
    }
  } else {
    return res.status(400).json({
      message:
        "Please provide either a location string or explicit latitude/longitude for search.",
    });
  }

  const queryStartTime = parseISO(`${date}T${arrivalTime}:00`);
  const queryEndTime = parseISO(`${date}T${exitTime}:00`);

  if (isNaN(queryStartTime.getTime()) || isNaN(queryEndTime.getTime())) {
    return res.status(400).json({
      message: "Invalid date or time format. Use YYYY-MM-DD and HH:MM.",
    });
  }
  if (queryStartTime >= queryEndTime) {
    return res
      .status(400)
      .json({ message: "Arrival time must be before exit time." });
  }
  if (queryStartTime < new Date()) {
    return res
      .status(400)
      .json({ message: "Cannot search for parking in the past." });
  }

  try {
    // Find ParkingZones near the target location using geospatial query
    const nearbyZones = await ParkingZone.find({
      location: {
        $nearSphere: {
          // Use $nearSphere for spherical geometry (Earth)
          $geometry: {
            type: "Point",
            coordinates: [targetLongitude, targetLatitude],
          },
          $maxDistance: parseFloat(radiusKm) * 1000,
        },
      },
    }).select("_id name address location");
    const nearbyZoneIds = nearbyZones.map((zone) => zone._id);

    // Find ParkingSlots that are 'AVAILABLE' or 'RESERVED' (to check for overlaps)
    // and are within the identified zones, optionally by slotType.
    const slotQuery = {
      parkingZone: { $in: nearbyZoneIds },
      isAvailable: true,
      status: { $in: ["AVAILABLE", "RESERVED"] },
    };
    if (slotType) {
      slotQuery.slotType = slotType.toUpperCase();
    }

    let candidateSlots = await ParkingSlot.find(slotQuery).populate(
      "parkingZone"
    );

    // Filter out slots that are actually occupied or have conflicting reservations
    const availableSlots = [];
    for (const slot of candidateSlots) {
      const isTrulyAvailable = await isSlotAvailableForBooking(
        slot._id,
        queryStartTime,
        queryEndTime
      );
      if (isTrulyAvailable) {
        availableSlots.push(slot);
      }
    }

    if (availableSlots.length === 0) {
      return res.status(200).json({
        message: "No parking spots found for your criteria.",
        slots: [],
      });
    }

    res.json({
      message: "Available parking spots found.",
      slots: availableSlots,
    });
  } catch (error) {
    console.error("Error during parking slot search:", error);
    res
      .status(500)
      .json({ message: "Server error during parking slot search." });
  }
};

modules.export = {
  createParkingSlot,
  isSlotAvailableForBooking,
  searchParkingSlots,
};

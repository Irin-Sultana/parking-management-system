const Log = require("../models/Log");

// @desc    Get all system logs (Admin only)
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find({})
      .populate("userId", "username email")
      .sort({ timestamp: -1 }); // Sort by most recent first
    res.json(logs);
  } catch (error) {
    console.error("Error fetching all logs:", error);
    res.status(500).json({ message: "Server error fetching logs." });
  }
};

// @desc    Get a single log entry by ID (Admin only)
// @route   GET /api/admin/logs/:id
// @access  Private/Admin
const getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id).populate(
      "userId",
      "username email"
    );
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ message: "Log entry not found." });
    }
  } catch (error) {
    console.error("Error fetching log by ID:", error);
    res
      .status(500)
      .json({ message: "Server error fetching log entry details." });
  }
};

module.exports = {
  getAllLogs,
  getLogById,
};

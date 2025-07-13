const { getParkingZones } = require("../controller/parkingZoneController");

router.route("/").get(getParkingZones);

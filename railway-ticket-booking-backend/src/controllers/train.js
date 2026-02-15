const { calculateFare } = require("../helper/commonFunctions");
const station = require("../models/station");
const trainRoute = require("../models/trainRoute");

// Cache for stations (memory cache for better performance)
let stationsCache = null;
let stationsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

exports.getAllStations = async (req, res) => {
  try {
    const now = Date.now();

    // Return cached data if available and not expired
    if (stationsCache && now - stationsCacheTime < CACHE_DURATION) {
      return res.json(stationsCache);
    }

    const stations = await station
      .find()
      .select("_id name code")
      .sort({ name: 1 });

    // Update cache
    stationsCache = stations;
    stationsCacheTime = now;

    res.json(stations);
  } catch (err) {
    console.error("Get stations error:", err);
    res.status(500).json({ error: "Failed to fetch stations" });
  }
};

exports.trainSearchResults = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Input validation
    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "From and To station codes are required" });
    }

    if (from === to) {
      return res
        .status(400)
        .json({ message: "From and To stations must be different" });
    }

    // Fetch stations
    const fromStation = await station.findOne({ code: from });
    const toStation = await station.findOne({ code: to });

    if (!fromStation || !toStation) {
      return res.status(400).json({ message: "Invalid station codes" });
    }

    // Optimize query with lean() and select only needed fields
    const routes = await trainRoute
      .find({
        "stops.stationId": { $all: [fromStation._id, toStation._id] },
      })
      .populate("trainId", "trainName trainNumber totalSeats")
      .populate("stops.stationId", "name code")
      .lean();

    const results = [];

    for (const route of routes) {
      const fromStop = route.stops.find((s) =>
        s.stationId._id.equals(fromStation._id),
      );
      const toStop = route.stops.find((s) =>
        s.stationId._id.equals(toStation._id),
      );

      if (!fromStop || !toStop) continue;
      if (fromStop.order >= toStop.order) continue;

      const fare = calculateFare(route.stops, fromStop.order, toStop.order);

      results.push({
        routeId: route._id,
        trainId: route.trainId._id,
        trainName: route.trainId.trainName,
        trainNumber: route.trainId.trainNumber,
        totalSeats: route.trainId.totalSeats,
        from: fromStation.name,
        to: toStation.name,
        fromCode: from,
        toCode: to,
        departureTime: fromStop.departureTime,
        arrivalTime: toStop.arrivalTime,
        fare,
      });
    }

    // Sort by departure time
    results.sort(
      (a, b) => new Date(a.departureTime) - new Date(b.departureTime),
    );

    res.json({
      count: results.length,
      trains: results,
    });
  } catch (err) {
    console.error("Train search error:", err);
    res.status(500).json({ error: "Failed to search trains" });
  }
};

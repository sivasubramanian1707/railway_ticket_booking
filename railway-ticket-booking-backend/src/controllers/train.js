const { calculateFare } = require("../helper/commonFunctions");
const station = require("../models/station");
const trainRoute = require("../models/trainRoute");

exports.getAllStations = async (req, res) => {
  try {
    const stations = await station.find().sort({ name: 1 });
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.trainSearchResults = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to)
      return res.status(400).json({ message: "From and To required" });

    const fromStation = await station.findOne({ code: from });
    const toStation = await station.findOne({ code: to });

    if (!fromStation || !toStation)
      return res.status(400).json({ message: "Invalid station codes" });

    const routes = await trainRoute
      .find({
        "stops.stationId": { $all: [fromStation._id, toStation._id] },
      })
      .populate("trainId")
      .populate("stops.stationId");

    const results = [];

    for (const route of routes) {
      const fromStop = route.stops.find((s) =>
        s.stationId._id.equals(fromStation._id)
      );
      const toStop = route.stops.find((s) =>
        s.stationId._id.equals(toStation._id)
      );

      if (!fromStop || !toStop) continue;
      if (fromStop.order >= toStop.order) continue;

      const fare = calculateFare(route.stops, fromStop.order, toStop.order);

      results.push({
        trainId: route.trainId._id,
        trainName: route.trainId.trainName,
        trainNumber: route.trainId.trainNumber,
        from: fromStation.name,
        to: toStation.name,
        departureTime: fromStop.departureTime,
        arrivalTime: toStop.arrivalTime,
        fare,
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

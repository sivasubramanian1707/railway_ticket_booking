exports.OTPGenerator = (length = 6) => {
  let digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

exports.calculateFare = (stops, fromOrder, toOrder) => {
  let fare = 0;

  for (const stop of stops) {
    if (stop.order >= fromOrder && stop.order < toOrder) {
      fare += stop.fareToNext;
    }
  }

  return fare;
};

exports.calculateFareForBooking = (route, fromId, toId) => {
  let fromOrder,
    toOrder,
    fare = 0;

  route.stops.forEach((stop) => {
    if (stop.stationId.equals(fromId)) fromOrder = stop.order;
    if (stop.stationId.equals(toId)) toOrder = stop.order;
  });

  if (fromOrder >= toOrder) throw new Error("Invalid station order");

  route.stops.forEach((stop) => {
    if (stop.order >= fromOrder && stop.order < toOrder) {
      fare += stop.fareToNext;
    }
  });

  return fare;
};

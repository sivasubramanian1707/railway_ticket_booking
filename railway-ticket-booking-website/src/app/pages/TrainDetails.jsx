import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bookTicket } from "../../actions/booking";
import "../../styles/trainDetails.css";

const TrainDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults, loading, error } = useSelector((state) => state.train);
  const { bookingLoading, bookingError, success, booking } = useSelector(
    (state) => state.booking,
  );
  const { token } = useSelector((state) => state.auth);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState([]);

  const train = searchResults?.find((t) => t.trainId === id);

  const today = new Date().toISOString().split("T")[0];

  const isFullyBooked = train?.availableSeats === 0;
  const bookedSeats = train?.bookedSeats || [];

  const handleSeatClick = (seatNumber) => {
    if (!token || isFullyBooked) return;
    if (bookedSeats.includes(seatNumber)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        const updated = prev.filter((seat) => seat !== seatNumber);
        setPassengers(updated.map(() => ({ name: "", age: "", gender: "" })));
        return updated;
      }

      if (prev.length >= 6) return prev;

      const updated = [...prev, seatNumber];
      setPassengers(updated.map(() => ({ name: "", age: "", gender: "" })));
      return updated;
    });
  };

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const handleBooking = async () => {
    if (!token) return;
    if (!selectedSeats.length) return;
    if (!travelDate) return;
    if (isFullyBooked) return;

    const isPassengerValid = passengers.every(
      (p) => p.name && p.age && p.gender,
    );

    if (!isPassengerValid) return;
    const data = {
      trainId: id,
      fromStationId: train?.fromCode,
      toStationId: train?.toCode,
      travelDate,
      seatsBooked: selectedSeats.length,
      passengers,
    };

    console.log(
      "Booking data:",
      id,
      train?.fromCode,
      train?.toCode,
      travelDate,
      selectedSeats.length,
      passengers,
    );

    const result = await dispatch(bookTicket(data));
    if (result.message === "Booking confirmed successfully") {
      navigate("/my-bookings");
    }
  };

  const totalAmount = selectedSeats.length * (train?.fare || 0);

  if (loading) {
    return (
      <div className="train-page">
        <div className="alert">Loading train details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="train-page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="train-page">
        <div className="alert">Train not found.</div>
      </div>
    );
  }

  return (
    <div className="train-page">
      <section className="train-header">
        <div className="train-info">
          <h2>{train?.name}</h2>
          <p>Train No: {train?.trainNumber}</p>
          <p>
            {train?.from} → {train?.to}
          </p>
          <p>
            Departure: {train?.departureTime} | Arrival: {train?.arrivalTime}
          </p>
          <p>Fare: ₹{train?.fare}</p>
        </div>

        <div
          className={`availability-badge ${
            isFullyBooked
              ? "badge-red"
              : train?.availableSeats < 20
                ? "badge-orange"
                : "badge-green"
          }`}
        >
          {isFullyBooked
            ? "Fully Booked"
            : `${train?.totalSeats} Seats Available`}
        </div>
      </section>

      {!token && (
        <div className="alert">
          Please login to book tickets.
          <Link to="/login" className="btn-primary">
            Login Now
          </Link>
        </div>
      )}

      {bookingError && <div className="alert alert-error">{bookingError}</div>}

      {success && (
        <div className="alert alert-success">
          Booking Confirmed 🎉
          <div>PNR: {booking?.pnr}</div>
        </div>
      )}

      <section className="booking-section">
        <div className="seat-grid">
          {Array.from({ length: train?.totalSeats || 0 }).map((_, index) => {
            const seatNumber = index + 1;
            const isBooked = bookedSeats.includes(seatNumber);
            const isSelected = selectedSeats.includes(seatNumber);

            return (
              <div
                key={seatNumber}
                className={`seat 
                  ${isBooked ? "seat-booked" : ""}
                  ${isSelected ? "seat-selected" : ""}
                  ${!token || isFullyBooked ? "seat-disabled" : ""}
                `}
                onClick={() => handleSeatClick(seatNumber)}
              >
                {seatNumber}
              </div>
            );
          })}
        </div>

        <div className="summary-card">
          <label>Travel Date</label>
          <input
            type="date"
            min={today}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            disabled={!token || isFullyBooked}
          />

          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-form">
              <h4>Passenger {index + 1}</h4>
              <input
                type="text"
                placeholder="Name"
                value={passenger.name}
                onChange={(e) =>
                  handlePassengerChange(index, "name", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Age"
                value={passenger.age}
                onChange={(e) =>
                  handlePassengerChange(index, "age", e.target.value)
                }
              />
              <select
                value={passenger.gender}
                onChange={(e) =>
                  handlePassengerChange(index, "gender", e.target.value)
                }
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          ))}

          <div className="price-row">
            <span>Seats Selected:</span>
            <span>{selectedSeats.length}</span>
          </div>

          <div className="price-row">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            className="btn-primary"
            disabled={
              bookingLoading ||
              !selectedSeats.length ||
              !travelDate ||
              isFullyBooked ||
              !token
            }
            onClick={handleBooking}
          >
            {bookingLoading ? "Processing..." : "Book Now"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default TrainDetails;

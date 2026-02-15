import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../../actions/booking";
import "../../styles/myBookings.css";
const MyBookings = () => {
  const dispatch = useDispatch();

  const { bookings, loading, error } = useSelector((state) => state.booking);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      dispatch(fetchMyBookings());
    }
  }, [dispatch, userData]);

  console.log("My Bookings:", bookings);

  if (!userData) {
    return (
      <div className="my-bookings-page center-auth">
        <div className="empty-state">
          <h3>Please login to view your bookings.</h3>
          <Link to="/login" className="btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <section className="bookings-header">
        <div>
          <h2>My Bookings</h2>
          <p>View your travel history and ticket details</p>
        </div>
        <div className="booking-count">
          Total Bookings: {bookings?.length || 0}
        </div>
      </section>

      <section className="bookings-content">
        {loading && (
          <div className="loader-wrapper">
            <div className="loader"></div>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && bookings?.length === 0 && (
          <div className="empty-state">
            <h3>You have no bookings yet.</h3>
            <p>Start booking your train tickets now.</p>
            <Link to="/search" className="btn-primary">
              Search Trains
            </Link>
          </div>
        )}

        {!loading && !error && bookings?.length > 0 && (
          <div className="bookings-grid">
            {bookings?.map((booking) => (
              <div className="booking-card" key={booking?.pnr}>
                <div className="booking-row">
                  <div className="booking-info">
                    <span className="label">Booking ID: </span>
                    <span>{booking?.pnr}</span>
                  </div>
                  <span
                    className={`status-badge ${
                      booking?.status === "Confirmed"
                        ? "status-confirmed"
                        : booking?.status === "Cancelled"
                          ? "status-cancelled"
                          : "status-pending"
                    }`}
                  >
                    {booking?.status || "Pending"}
                  </span>
                </div>

                <div className="divider"></div>

                <div className="booking-row">
                  <div className="booking-info">
                    <span className="label">Train: </span>
                    <span>
                      {booking?.trainName || "N/A"} (
                      {booking?.trainNumber || "N/A"})
                    </span>
                  </div>
                </div>

                <div className="booking-row">
                  <div className="booking-info">
                    <span className="label">Route: </span>
                    <span>
                      {booking?.fromStation || "N/A"} →{" "}
                      {booking?.toStation || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="booking-row two-column">
                  <div className="booking-info">
                    <span className="label">Travel Date: </span>
                    <span>
                      {booking?.travelDate
                        ? new Date(booking.travelDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="booking-row">
                  <div className="booking-info">
                    <span className="label">Seats: </span>
                    <span>{booking?.seatsBooked || "N/A"}</span>
                  </div>
                </div>

                <div className="booking-row two-column">
                  <div className="booking-info">
                    <span className="label">Total Amount: </span>
                    <span>₹ {booking?.totalFare || 0}</span>
                  </div>

                  <div className="booking-info">
                    <span className="label">Booked On: </span>
                    <span>
                      {booking?.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBookings;

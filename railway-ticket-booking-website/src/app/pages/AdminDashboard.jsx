import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  addStation,
  addTrain,
  addRoute,
  clearAdminMessage,
  fetchTrains,
} from "../../actions/admin";
import { fetchStations } from "../../actions/train";
import "../../styles/admin.css";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { stations } = useSelector((state) => state.train || {});
  const {
    bookings,
    pagination,
    loading,
    error,
    successMessage,
    trains,
    stations: adminStations,
  } = useSelector((state) => state.admin || {});

  // Local state
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [stationForm, setStationForm] = useState({ name: "", code: "" });
  const [trainForm, setTrainForm] = useState({
    trainName: "",
    trainNumber: "",
    totalSeats: "",
  });
  const [routeForm, setRouteForm] = useState({
    trainId: "",
    stops: [
      {
        stationId: "",
        arrivalTime: "",
        departureTime: "",
        fareToNext: "",
      },
    ],
  });

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...routeForm.stops];
    updatedStops[index][field] = value;
    setRouteForm({ ...routeForm, stops: updatedStops });
  };

  const addStopField = () => {
    setRouteForm({
      ...routeForm,
      stops: [
        ...routeForm.stops,
        { stationId: "", arrivalTime: "", departureTime: "", fareToNext: "" },
      ],
    });
  };

  const removeStopField = (index) => {
    const updatedStops = routeForm.stops.filter((_, i) => i !== index);
    setRouteForm({ ...routeForm, stops: updatedStops });
  };

  // Fetch initial data on mount
  useEffect(() => {
    dispatch(fetchStations());
    dispatch(fetchTrains());
    dispatch(fetchAllBookings(currentPage, 10));
  }, [dispatch, currentPage]);

  // Clear message on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAdminMessage());
    };
  }, [dispatch]);

  // Role protection
  if (!userData || userData?.role !== "ADMIN") {
    return (
      <div className="admin-container-denied">
        <div className="access-denied-card">
          <div className="access-denied-icon">🔐</div>
          <h2>Access Denied</h2>
          <p>You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  // Form handlers
  const handleAddStation = useCallback(
    async (e) => {
      e.preventDefault();
      if (!stationForm.name.trim() || !stationForm.code.trim()) {
        return;
      }
      try {
        await dispatch(
          addStation(stationForm.name.trim(), stationForm.code.trim()),
        );
        setStationForm({ name: "", code: "" });
      } catch (err) {
        // Error is in Redux state
      }
    },
    [dispatch, stationForm],
  );

  const handleAddTrain = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !trainForm.trainName.trim() ||
        !trainForm.trainNumber.trim() ||
        !trainForm.totalSeats
      ) {
        return;
      }
      const seats = parseInt(trainForm.totalSeats, 10);
      if (isNaN(seats) || seats <= 0) {
        return;
      }
      try {
        await dispatch(
          addTrain(
            trainForm.trainNumber.trim(),
            trainForm.trainName.trim(),
            seats,
          ),
        );
        setTrainForm({ trainName: "", trainNumber: "", totalSeats: "" });
      } catch (err) {
        // Error is in Redux state
      }
    },
    [dispatch, trainForm],
  );

  const handleAddRoute = useCallback(
    async (e) => {
      e.preventDefault();

      if (!routeForm.trainId || routeForm.stops.length === 0) return;

      const formattedStops = routeForm.stops.map((stop, index) => ({
        stationId: stop.stationId,
        arrivalTime: stop.arrivalTime || null,
        departureTime: stop.departureTime || null,
        order: index + 1,
        fareToNext: Number(stop.fareToNext) || 0,
      }));

      try {
        await dispatch(addRoute(routeForm.trainId, formattedStops));
        setRouteForm({
          trainId: "",
          stops: [
            {
              stationId: "",
              arrivalTime: "",
              departureTime: "",
              fareToNext: "",
            },
          ],
        });
      } catch (err) {}
    },
    [dispatch, routeForm],
  );

  const handleDeleteStation = useCallback(() => {
    if (!deleteTarget) return;
    // TODO: implement delete action when backend provides it
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }, [deleteTarget]);

  const getStatusBadgeClass = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "status-badge status-confirmed";
      case "cancelled":
        return "status-badge status-cancelled";
      case "pending":
        return "status-badge status-pending";
      default:
        return "status-badge status-pending";
    }
  }, []);

  const totalRevenue = bookings?.reduce(
    (sum, booking) => sum + (booking.totalFare || 0),
    0,
  );

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <div className="admin-header">
              <h1>Dashboard Overview</h1>
            </div>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <p className="stat-label">Total Stations</p>
                <p className="stat-value">{stations?.length || 0}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚆</div>
                <p className="stat-label">Total Trains</p>
                <p className="stat-value">{trains?.length || 0}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <p className="stat-label">Total Bookings</p>
                <p className="stat-value">{bookings?.length || 0}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <p className="stat-label">Revenue</p>
                <p className="stat-value">₹{totalRevenue || 0}</p>
              </div>
            </div>
          </div>
        );

      case "add-station":
        return (
          <div>
            <div className="admin-header">
              <h1>Add Station</h1>
            </div>
            {error && <Alert type="error" message={error} />}
            {successMessage && (
              <Alert type="success" message={successMessage} />
            )}
            <form className="admin-form" onSubmit={handleAddStation}>
              <div className="form-group">
                <label className="form-label" htmlFor="station-name">
                  Station Name
                </label>
                <input
                  id="station-name"
                  type="text"
                  className="form-input"
                  value={stationForm.name}
                  onChange={(e) =>
                    setStationForm({ ...stationForm, name: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="station-code">
                  Station Code
                </label>
                <input
                  id="station-code"
                  type="text"
                  className="form-input"
                  value={stationForm.code}
                  onChange={(e) =>
                    setStationForm({ ...stationForm, code: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                    </>
                  ) : (
                    "Add Station"
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case "add-train":
        return (
          <div>
            <div className="admin-header">
              <h1>Add Train</h1>
            </div>
            {error && <Alert type="error" message={error} />}
            {successMessage && (
              <Alert type="success" message={successMessage} />
            )}
            <form className="admin-form" onSubmit={handleAddTrain}>
              <div className="form-group">
                <label className="form-label" htmlFor="train-name">
                  Train Name
                </label>
                <input
                  id="train-name"
                  type="text"
                  className="form-input"
                  value={trainForm.trainName}
                  onChange={(e) =>
                    setTrainForm({ ...trainForm, trainName: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="train-number">
                  Train Number
                </label>
                <input
                  id="train-number"
                  type="text"
                  className="form-input"
                  value={trainForm.trainNumber}
                  onChange={(e) =>
                    setTrainForm({ ...trainForm, trainNumber: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="total-seats">
                  Total Seats
                </label>
                <input
                  id="total-seats"
                  type="number"
                  className="form-input"
                  value={trainForm.totalSeats}
                  onChange={(e) =>
                    setTrainForm({ ...trainForm, totalSeats: e.target.value })
                  }
                  min="1"
                  disabled={loading}
                  required
                />
              </div>
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                    </>
                  ) : (
                    "Add Train"
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case "manage-trains":
        return (
          <div>
            <div className="admin-header">
              <h1>All Trains</h1>
            </div>
            {error && <Alert type="error" message={error} />}
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Train Name</th>
                    <th>Train Number</th>
                    <th>Total Seats</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trains?.length > 0 ? (
                    trains.map((train) => (
                      <tr key={train._id || train.trainNumber}>
                        <td>{train.name || train.trainName || "N/A"}</td>
                        <td>{train.trainNumber || "N/A"}</td>
                        <td>{train.totalSeats || "N/A"}</td>
                        <td>
                          <span className="status-badge status-confirmed">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No trains added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "manage-routes":
        return (
          <div>
            <div className="admin-header">
              <h1>Manage Routes</h1>
            </div>

            {error && <Alert type="error" message={error} />}
            {successMessage && (
              <Alert type="success" message={successMessage} />
            )}

            <form className="admin-form" onSubmit={handleAddRoute}>
              {/* Train Selection */}
              <div className="form-group">
                <label className="form-label">Select Train</label>
                <select
                  className="form-input"
                  value={routeForm.trainId}
                  onChange={(e) =>
                    setRouteForm({ ...routeForm, trainId: e.target.value })
                  }
                  required
                >
                  <option value="">Choose Train</option>
                  {trains?.map((train) => (
                    <option key={train._id} value={train._id}>
                      {train.trainName} ({train.trainNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Stops Section */}
              <h3 style={{ marginBottom: "12px" }}>Route Stops</h3>

              {routeForm.stops.map((stop, index) => (
                <div key={index} className="route-stop-card">
                  <div className="form-group">
                    <label>Station</label>
                    <select
                      className="form-input"
                      value={stop.stationId}
                      onChange={(e) =>
                        handleStopChange(index, "stationId", e.target.value)
                      }
                      required
                    >
                      <option value="">Select Station</option>
                      {stations?.map((station) => (
                        <option key={station._id} value={station._id}>
                          {station.name} ({station.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Arrival Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={stop.arrivalTime}
                      onChange={(e) =>
                        handleStopChange(index, "arrivalTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Departure Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={stop.departureTime}
                      onChange={(e) =>
                        handleStopChange(index, "departureTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Fare To Next</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={stop.fareToNext}
                      onChange={(e) =>
                        handleStopChange(index, "fareToNext", e.target.value)
                      }
                    />
                  </div>

                  {routeForm.stops.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeStopField(index)}
                    >
                      Remove Stop
                    </button>
                  )}
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={addStopField}
                >
                  + Add Another Stop
                </button>
              </div>

              <div className="btn-group" style={{ marginTop: "20px" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Create Route"}
                </button>
              </div>
            </form>
          </div>
        );

      case "view-bookings":
        return (
          <div>
            <div className="admin-header">
              <h1>All Bookings</h1>
            </div>
            {error && <Alert type="error" message={error} />}
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Spinner />
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>User Name</th>
                        <th>Train</th>
                        <th>Date</th>
                        <th>Seats</th>
                        <th>Status</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings?.length > 0 ? (
                        bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>{booking._id?.slice(-6) || "N/A"}</td>
                            <td>{booking.userId.name || "N/A"}</td>
                            <td>{booking.trainId.trainName || "N/A"}</td>
                            <td>{booking.travelDate || "N/A"}</td>
                            <td>{booking.seatsBooked || 0}</td>
                            <td>
                              <span
                                className={getStatusBadgeClass(booking.status)}
                              >
                                {booking.status || "Pending"}
                              </span>
                            </td>
                            <td>₹{booking.totalFare || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No bookings found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>
                  <span style={{ margin: "0 16px" }}>
                    Page {currentPage} of {pagination?.totalPages || 1}
                  </span>
                  <button
                    className={`pagination-btn ${
                      currentPage >= (pagination?.totalPages || 1)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage >= (pagination?.totalPages || 1)}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  }, [
    activeTab,
    stations,
    bookings,
    pagination,
    error,
    successMessage,
    loading,
    stationForm,
    trainForm,
    routeForm,
    handleAddStation,
    handleAddTrain,
    handleAddRoute,
    getStatusBadgeClass,
    currentPage,
    trains,
  ]);

  return (
    <div className="admin-page">
      {/* Delete Modal */}
      <div className={`modal-overlay ${showDeleteModal ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Confirm Delete</h3>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </div>
          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="btn-danger" onClick={handleDeleteStation}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "active" : ""}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <ul className="admin-tabs">
          <li
            className={`admin-tab ${activeTab === "overview" ? "admin-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              setSidebarOpen(false);
            }}
          >
            📊 Overview
          </li>
          <li
            className={`admin-tab ${activeTab === "add-station" ? "admin-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("add-station");
              setSidebarOpen(false);
            }}
          >
            🏢 Station
          </li>
          <li
            className={`admin-tab ${activeTab === "add-train" ? "admin-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("add-train");
              setSidebarOpen(false);
            }}
          >
            ➕ Add Train
          </li>
          <li
            className={`admin-tab ${activeTab === "manage-trains" ? "admin-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("manage-trains");
              setSidebarOpen(false);
            }}
          >
            🚆 Trains
          </li>
          <li
            className={`admin-tab ${activeTab === "manage-routes" ? "admin-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("manage-routes");
              setSidebarOpen(false);
            }}
          >
            🔁 Routes
          </li>
          <li
            className={`admin-tab ${activeTab === "view-bookings" ? "admin-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("view-bookings");
              setSidebarOpen(false);
            }}
          >
            📅 Bookings
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">{renderTabContent()}</main>
    </div>
  );
};

export default AdminDashboard;

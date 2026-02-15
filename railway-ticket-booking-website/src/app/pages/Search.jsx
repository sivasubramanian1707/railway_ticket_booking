import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStations, searchTrains } from "../../actions/train";
import "../../styles/search.css";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";

const Search = () => {
  const dispatch = useDispatch();
  const { stations, searchResults, loading, error } = useSelector(
    (state) => state.train || {},
  );

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [validationError, setValidationError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Get minimum date (today)
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  // Fetch stations on mount
  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  const getSeatBadgeClass = useCallback((availableSeats) => {
    if (availableSeats > 10) return "seat-badge seat-badge-high";
    if (availableSeats > 0) return "seat-badge seat-badge-medium";
    return "seat-badge seat-badge-low";
  }, []);

  const getSeatBadgeText = useCallback((availableSeats) => {
    if (availableSeats > 10) return `${availableSeats} Seats`;
    if (availableSeats > 0) return `${availableSeats} Left`;
    return "Full";
  }, []);

  const validate = useCallback(() => {
    if (!from || !to || !date) {
      setValidationError("Please fill in all fields.");
      return false;
    }
    if (from === to) {
      setValidationError("From and To stations must be different.");
      return false;
    }
    setValidationError("");
    return true;
  }, [from, to, date]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (!validate()) return;
      setHasSearched(true);
      dispatch(searchTrains(from, to));
    },
    [dispatch, from, to, validate],
  );

  const handleSwap = useCallback(() => {
    if (from && to) {
      setFrom(to);
      setTo(from);
    }
  }, [from, to]);

  const stationOptions = useMemo(
    () => stations?.map((s) => (typeof s === "string" ? s : s.name || s)) || [],
    [stations],
  );

  const trainCount = searchResults?.length || 0;

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Search Form Card */}
        <section className="search-card">
          <h2
            style={{ margin: "0 0 24px", fontSize: "22px", color: "#0a3d62" }}
          >
            Find Trains
          </h2>

          {validationError && <Alert type="error" message={validationError} />}

          <form className="search-form" onSubmit={handleSearch} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="from">
                From
              </label>
              <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                disabled={loading}
              >
                <option value="">Select station</option>
                {stations.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="to">
                To
              </label>
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={loading}
              >
                <option value="">Select station</option>
                {stations.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Travel Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="search-button-wrapper">
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Searching...</span>
                  </>
                ) : (
                  "Search"
                )}
              </button>
              <button
                type="button"
                className="btn-search"
                onClick={handleSwap}
                disabled={loading || !from || !to}
                style={{ background: "#1e5f74" }}
              >
                ⇄
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        {hasSearched && (
          <section className="results-section">
            {error && <Alert type="error" message={error} />}

            {loading ? (
              <div className="loading-container">
                <Spinner />
                <p style={{ marginTop: "16px", color: "#51646a" }}>
                  Finding trains...
                </p>
              </div>
            ) : !searchResults || searchResults.length === 0 ? (
              <EmptyState message="No trains found for your search. Try different stations or date.">
                <button
                  onClick={() => setHasSearched(false)}
                  style={{
                    marginTop: "20px",
                    padding: "10px 24px",
                    background: "#0a3d62",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  New Search
                </button>
              </EmptyState>
            ) : (
              <>
                <div className="results-header">
                  <span className="results-count">
                    Found {trainCount} train{trainCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="trains-grid">
                  {searchResults?.map((train) => {
                    const availableSeats = train.totalSeats || 0;
                    const isDisabled = availableSeats === 0;

                    return (
                      <article key={train.trainId} className="train-card">
                        <div className="train-header">
                          <div>
                            <h3 className="train-name">
                              {train.trainName || "Train"}
                            </h3>
                            <p className="train-number">
                              #{train.trainNumber || train._id?.slice(-4)}
                            </p>
                          </div>
                        </div>

                        <div className="train-info">
                          <div className="train-route">
                            <div className="train-from">
                              {train.from || "N/A"}
                            </div>
                            <div className="arrow">↓</div>
                            <div className="train-to">{train.to || "N/A"}</div>
                          </div>

                          <div className="train-times">
                            <div>
                              <div className="train-time-label">Depart</div>
                              <div className="train-departure">
                                {train.departureTime || "--:--"}
                              </div>
                            </div>
                            <div>
                              <div className="train-time-label">Arrive</div>
                              <div className="train-arrival">
                                {train.arrivalTime || "--:--"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="train-meta">
                          <div className="train-seats">
                            <span className={getSeatBadgeClass(availableSeats)}>
                              {getSeatBadgeText(availableSeats)}
                            </span>
                          </div>
                          <div className="train-action">
                            <Link
                              to={`/train/${train.trainId}`}
                              className="btn-view-details"
                              style={
                                isDisabled ? { pointerEvents: "none" } : {}
                              }
                            >
                              {isDisabled ? "Sold Out" : "Book Now"}
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Search;

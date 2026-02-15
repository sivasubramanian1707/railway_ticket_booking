import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../styles/ui-components.css";
import "../../styles/home.css";
import Button from "../../components/Button";
import Card from "../../components/Card";

const features = [
  {
    id: 1,
    title: "Secure Booking",
    desc: "PCI-level security for payments and personal data.",
  },
  {
    id: 2,
    title: "Real-Time Availability",
    desc: "Live seat availability and instant updates.",
  },
  {
    id: 3,
    title: "Easy Cancellation",
    desc: "Hassle-free refunds and flexible policies.",
  },
];

const Home = () => {
  const { userData, token } = useSelector((state) => state.auth || {});

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="home-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Book Railway Tickets Easily & Securely
            </h1>
            <p className="hero-sub">
              Search trains, check availability, and reserve seats instantly.
            </p>

            <div className="hero-ctas">
              {userData ? (
                <Link to="/search" className="inline-link">
                  <Button variant="primary">Search Trains</Button>
                </Link>
              ) : (
                <Link to="/login" className="inline-link">
                  <Button variant="primary">Login to Book</Button>
                </Link>
              )}

              {userData ? (
                <Link to="/my-bookings" className="inline-link">
                  <Button variant="outline" style={{ color: "#fff" }}>
                    My Bookings
                  </Button>
                </Link>
              ) : (
                <Link to="/register" className="inline-link">
                  <Button variant="secondary">Register</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            <div className="rail-illustration" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="home-container">
          <h2 className="section-title">Why choose us</h2>
          <div className="features-grid">
            {features.map((f) => (
              <Card key={f.id} className="feature-card">
                <div className="feature-icon" aria-hidden="true" />
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="home-container cta-inner">
          <h2 className="cta-title">Ready to Travel?</h2>
          <p className="cta-sub">
            Find your train and book your seat in minutes.
          </p>
          <Link to="/search">
            <Button variant="primary">Start Searching</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

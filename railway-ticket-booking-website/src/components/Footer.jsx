import React from "react";
import "../styles/ui-components.css";

const Footer = () => {
  return (
    <footer className="rs-footer">
      <div className="rs-container">
        © {new Date().getFullYear()} Railway Ticket Booking • Built with care
      </div>
    </footer>
  );
};

export default Footer;

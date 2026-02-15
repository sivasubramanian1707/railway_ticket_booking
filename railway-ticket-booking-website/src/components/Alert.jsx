import React from "react";
import "../styles/ui-components.css";

const Alert = ({ type = "error", message }) => {
  if (!message) return null;
  const cls = `rs-alert rs-alert-${type}`;
  return (
    <div className={cls} role="alert">
      <div className="rs-alert-icon" aria-hidden="true">
        {type === "error" ? "✖" : type === "success" ? "✔" : "!"}
      </div>
      <div className="rs-alert-message">{message}</div>
    </div>
  );
};

export default Alert;

import React from "react";
import "../styles/ui-components.css";

const EmptyState = ({ message = "Nothing to show here", children }) => {
  return (
    <div className="rs-empty">
      <svg
        viewBox="0 0 64 64"
        width="160"
        height="160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="18" width="48" height="36" rx="4" fill="#EAF2F5" />
        <path
          d="M12 22h40"
          stroke="#D3E7EA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="rs-empty-text">{message}</div>
      {children}
    </div>
  );
};

export default EmptyState;

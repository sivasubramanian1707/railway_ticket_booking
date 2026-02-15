import React from "react";
import "../styles/ui-components.css";

const Card = ({ children, className = "", ...rest }) => {
  return (
    <div className={`rs-card ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;

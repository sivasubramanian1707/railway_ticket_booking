import React from "react";
import "../styles/ui-components.css";

const Spinner = ({ size = "md" }) => {
  const cls = size === "sm" ? "rs-spinner rs-spinner-sm" : "rs-spinner";
  return <span className={cls} aria-hidden="true" />;
};

export default Spinner;

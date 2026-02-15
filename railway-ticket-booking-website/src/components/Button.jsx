import React from "react";
import "../styles/ui-components.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  style = {},
  ...rest
}) => {
  const cls = `rs-btn rs-btn-${variant} ${className}`.trim();
  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      style={style}
      {...rest}
    >
      {loading ? (
        <span className="rs-btn-content">
          <span className="rs-spinner rs-spinner-sm" aria-hidden="true" />
          <span className="rs-btn-text">{children}</span>
        </span>
      ) : (
        <span className="rs-btn-content">
          <span className="rs-btn-text">{children}</span>
        </span>
      )}
    </button>
  );
};

export default Button;

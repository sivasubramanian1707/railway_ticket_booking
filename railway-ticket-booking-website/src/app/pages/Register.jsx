import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../../actions/auth";
import "../../styles/auth.css";
import Button from "../../components/Button";
import Alert from "../../components/Alert";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, userData, token } = useSelector(
    (state) => state.auth || {},
  );
  const user = userData || null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = useCallback(() => {
    const errors = {};
    if (!name.trim()) errors.name = "Full name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!emailRegex.test(email.trim()))
      errors.email = "Enter a valid email.";
    if (!phone.trim()) errors.phone = "Phone is required.";
    else if (!phoneRegex.test(phone.trim()))
      errors.phone = "Phone must be 10 digits.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (!confirm) errors.confirm = "Please confirm your password.";
    else if (password !== confirm) errors.confirm = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [name, email, phone, password, confirm]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      if (!validate()) return;
      try {
        await dispatch(
          signup(name.trim(), email.trim(), phone.trim(), password),
        );
      } catch (err) {
        // backend error placed in Redux state
      }
    },
    [dispatch, name, email, phone, password, loading, validate],
  );

  return (
    <div className="auth-page">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="register-heading"
      >
        <h2 id="register-heading">Create Your Account</h2>

        {error && <Alert type="error" message={error} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${fieldErrors.name ? "input-error" : name ? "input-valid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={loading}
            />
            {fieldErrors.name && (
              <div className="form-error">{fieldErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${fieldErrors.email ? "input-error" : email ? "input-valid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
            {fieldErrors.email && (
              <div className="form-error">{fieldErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form-input ${fieldErrors.phone ? "input-error" : phone ? "input-valid" : ""}`}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              autoComplete="tel"
              required
              disabled={loading}
            />
            {fieldErrors.phone && (
              <div className="form-error">{fieldErrors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${fieldErrors.password ? "input-error" : password ? "input-valid" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password && (
              <div className="form-error">{fieldErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">
              Confirm Password
            </label>
            <div className="password-wrap">
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                className={`form-input ${fieldErrors.confirm ? "input-error" : confirm ? "input-valid" : ""}`}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.confirm && (
              <div className="form-error">{fieldErrors.confirm}</div>
            )}
          </div>

          <div className="form-group">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </div>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../actions/auth";
import "../../styles/auth.css";
import Button from "../../components/Button";
import Alert from "../../components/Alert";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (!email.trim() || !password) {
      setLocalError("Please enter email and password.");
      return false;
    }
    setLocalError("");
    return true;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return; // prevent double submit
      if (!validate()) return;
      try {
        await dispatch(login(email.trim(), password));
      } catch (err) {
        // login thunk dispatches error into state; nothing else to do here
      }
    },
    [dispatch, email, password, loading, validate],
  );

  return (
    <div className="auth-page">
      <div className="auth-card" role="region" aria-labelledby="login-heading">
        <h2 id="login-heading">Login to Your Account</h2>

        {localError && <Alert type="error" message={localError} />}
        {error && <Alert type="error" message={error} />}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${!email.trim() && localError ? "input-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
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
                className={`form-input ${!password && localError ? "input-error" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={0}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="btn-primary"
              disabled={loading}
            >
              Login
            </Button>
          </div>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

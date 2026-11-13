
import { useState } from "react";
import "./Login.css";
import { loginAdmin } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
        const data = await loginAdmin(email, password);

        setPassword("");

console.log("Login successful:", data.admin);

navigate("/dashboard", { replace: true });
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Branding Section */}
        <div className="login-brand">
          <div className="brand-logo">
            <span className="logo-icon">L</span>
            <span>LendTrack</span>
          </div>

          <div className="brand-content">
            <span className="brand-tagline">
              PERSONAL FINANCE MANAGEMENT
            </span>

            <h1>
              Manage your lending.
              <br />
              <span>Stay in control.</span>
            </h1>

            <p>
              Track loans, manage repayments, calculate interest
              and keep all your lending records organized in one place.
            </p>

            <div className="brand-features">
              <div>
                <span className="feature-check">✓</span>
                Smart loan tracking
              </div>
              <div>
                <span className="feature-check">✓</span>
                Interest management
              </div>
              <div>
                <span className="feature-check">✓</span>
                Payment monitoring
              </div>
            </div>
          </div>

          <div className="brand-footer">
            © 2026 LendTrack. All rights reserved.
          </div>
        </div>

        {/* Right Login Section */}
        <div className="login-form-section">
          <div className="login-card">

            <div className="admin-badge">
              <span className="admin-dot"></span>
              ADMIN ACCESS
            </div>

            <h2>Welcome back</h2>

            <p className="login-subtitle">
              Sign in to access your personal dashboard.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
    <p className="login-error">{error}</p>
)}

{success && (
    <p className="login-success">{success}</p>
)}

              <button
    type="submit"
    className="login-button"
    disabled={loading}
>
    {loading ? "Signing in..." : "Sign In"}
    {!loading && <span>→</span>}
</button>

            </form>

            <div className="login-security">
              <span>🔒</span>
              Secure access for authorized administrator only
            </div>

            <div className="login-bottom">
              LendTrack <span>•</span> Personal Lending System
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;

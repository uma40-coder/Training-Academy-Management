import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../components/StudentLogin.css";
import { saveAuth } from "../utils/auth";

const StudentLogin = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Forgot Password Modal States ──
  const [showFpModal, setShowFpModal] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [fpError, setFpError] = useState("");
  const [fpSuccess, setFpSuccess] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  const navigate = useNavigate();

  const loginHandle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: "student",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store JWT + student info
      saveAuth("student", {
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email,
        id: data.id,
      });

      // Also keep currentUser for backward compatibility with dashboard pages
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: data.id,
          Fname: data.name.split(" ")[0] || data.name,
          Lname: data.name.split(" ").slice(1).join(" ") || "",
          Email: data.email,
          token: data.token,
        })
      );

      navigate("/StudentDashboard/dashboard");
    } catch (err) {
      console.log(err);
      setError("Cannot connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Open Forgot Password Modal ──
  const openFpModal = () => {
    setFpEmail(email || "");
    setFpOtp("");
    setReceivedOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setFpError("");
    setFpSuccess("");
    setFpStep(1);
    setShowFpModal(true);
  };

  // ── Step 1 & Resend: Send OTP ──
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setFpError("");
    setFpSuccess("");
    setFpLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFpError(data.message || "Failed to send OTP");
        return;
      }

      if (data.otp) {
        setReceivedOtp(data.otp);
      }

      setFpSuccess(`OTP sent to ${fpEmail}! Check your inbox.`);
      setFpStep(2);
    } catch (err) {
      setFpError("Cannot connect to server. Is the backend running?");
    } finally {
      setFpLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    setFpSuccess("");
    setFpLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFpError(data.message || "Invalid OTP");
        return;
      }

      setFpSuccess("OTP verified! Set your new password.");
      setFpStep(3);
    } catch (err) {
      setFpError("Cannot connect to server. Is the backend running?");
    } finally {
      setFpLoading(false);
    }
  };

  // ── Step 3: Reset Password & Auto-Login to Dashboard ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFpError("");
    setFpSuccess("");

    if (newPassword !== confirmPassword) {
      setFpError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setFpError("Password must be at least 6 characters long.");
      return;
    }

    setFpLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          otp: fpOtp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFpError(data.message || "Failed to reset password");
        return;
      }

      // Password reset success -> Save Auth & redirect to Student Dashboard
      saveAuth("student", {
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email,
        id: data.id,
      });

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: data.id,
          Fname: data.name.split(" ")[0] || data.name,
          Lname: data.name.split(" ").slice(1).join(" ") || "",
          Email: data.email,
          token: data.token,
        })
      );

      setShowFpModal(false);
      navigate("/StudentDashboard/dashboard");
    } catch (err) {
      setFpError("Cannot connect to server. Is the backend running?");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* Animated Orbs */}
      <div className="bubble-orb-1"></div>
      <div className="bubble-orb-2"></div>

      <div className="login-card">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: "#7C6FFF", fontWeight: 600, fontSize: 13, marginBottom: 16 }}>
          ← Back to Home
        </Link>
        <div className="login-logo">NexAcademy</div>
        <h2 className="login-title">Student Login</h2>
        <p className="login-sub">Welcome back! Login to your portal</p>

        <form onSubmit={loginHandle} autoComplete="off">
          {/* Anti-autofill dummy inputs */}
          <input type="text" name="fake_email_prevent_autofill" style={{ display: "none" }} tabIndex="-1" aria-hidden="true" />
          <input type="password" name="fake_password_prevent_autofill" style={{ display: "none" }} tabIndex="-1" aria-hidden="true" />

          <div className="login-form-group">
            <label>Email Address</label>
            <input
              className="login-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              onFocus={(e) => e.target.removeAttribute("readonly")}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="login-form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                className="login-forgot-btn"
                onClick={openFpModal}
              >
                Forgot Password?
              </button>
            </div>
            <div className="login-pass-wrap">
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly
                onFocus={(e) => e.target.removeAttribute("readonly")}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/Studreg" className="login-link">
            Register here
          </Link>
        </p>

        <p className="login-footer" style={{ marginTop: 8 }}>
          <Link to="/" className="login-link">
            ← Back to Home
          </Link>
        </p>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showFpModal && (
        <div className="fp-modal-overlay">
          <div className="fp-modal-card">
            <button className="fp-close-btn" onClick={() => setShowFpModal(false)}>
              <FaTimes />
            </button>

            <h3 className="fp-title">
              {fpStep === 1 && "Forgot Password"}
              {fpStep === 2 && "Enter Verification OTP"}
              {fpStep === 3 && "Set New Password"}
            </h3>
            <p className="fp-sub">
              {fpStep === 1 && "Enter your registered student email to receive a 6-digit verification code."}
              {fpStep === 2 && `We sent a 6-digit OTP code to ${fpEmail}.`}
              {fpStep === 3 && "Create a new strong password for your student account."}
            </p>

            {/* Step Indicators */}
            <div className="fp-step-indicator">
              <div className={`fp-step-dot ${fpStep === 1 ? "active" : fpStep > 1 ? "done" : ""}`}>1</div>
              <div className={`fp-step-line ${fpStep > 1 ? "active" : ""}`}></div>
              <div className={`fp-step-dot ${fpStep === 2 ? "active" : fpStep > 2 ? "done" : ""}`}>2</div>
              <div className={`fp-step-line ${fpStep > 2 ? "active" : ""}`}></div>
              <div className={`fp-step-dot ${fpStep === 3 ? "active" : ""}`}>3</div>
            </div>

            {fpSuccess && <div className="fp-success-msg">{fpSuccess}</div>}
            {fpError && <div className="login-error">{fpError}</div>}

            {/* Step 1: Send OTP Form */}
            {fpStep === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="login-form-group">
                  <label>Registered Student Email</label>
                  <input
                    className="login-input"
                    type="email"
                    placeholder="Enter student email"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="login-btn" disabled={fpLoading}>
                  {fpLoading ? "Sending OTP..." : "Send Verification OTP"}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP Form */}
            {fpStep === 2 && (
              <form onSubmit={handleVerifyOtp}>
                {receivedOtp && (
                  <div className="fp-otp-hint">
                    🔐 Verification OTP: <strong>{receivedOtp}</strong>
                  </div>
                )}
                <div className="login-form-group">
                  <label>6-Digit OTP Code</label>
                  <input
                    className="login-input"
                    type="text"
                    maxLength="6"
                    placeholder="e.g. 123456"
                    value={fpOtp}
                    onChange={(e) => setFpOtp(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={fpLoading}>
                  {fpLoading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="fp-resend-row">
                  <span>Didn't receive email?</span>
                  <button
                    type="button"
                    className="fp-resend-btn"
                    onClick={handleSendOtp}
                    disabled={fpLoading}
                  >
                    Resend Email / OTP
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Set New Password Form */}
            {fpStep === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="login-form-group">
                  <label>New Password</label>
                  <div className="login-pass-wrap">
                    <input
                      className="login-input"
                      type={showNewPass ? "text" : "password"}
                      placeholder="Enter new password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="login-eye-btn"
                      onClick={() => setShowNewPass(!showNewPass)}
                    >
                      {showNewPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="login-form-group">
                  <label>Confirm New Password</label>
                  <input
                    className="login-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={fpLoading}>
                  {fpLoading ? "Updating & Logging In..." : "Confirm & Go to Dashboard"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;

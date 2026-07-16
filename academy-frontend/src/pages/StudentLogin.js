import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../components/StudentLogin.css";

const StudentLogin = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginHandle = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      const user = await response.json();

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          Fname: user.firstName,
          Lname: user.lastName,
          Email: user.email,
          StudPass: user.password,
          Phone: user.phone,
          Course: user.course,
          Timing: user.timing,
          status: user.status,
        }),
      );

      navigate("/StudentDashboard/dashboard");
    } catch (error) {
      console.log(error);
      setError("Backend not connected");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">NexAcademy</div>
        <h2 className="login-title">Student Login</h2>
        <p className="login-sub">Welcome back! Login to your portal</p>

        <form onSubmit={loginHandle}>
          <div className="login-form-group">
            <label>Email Address</label>
            <input
              className="login-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <div className="login-pass-wrap">
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="login-btn">
            Login
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
    </div>
  );
};

export default StudentLogin;

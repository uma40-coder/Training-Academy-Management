import React, { useEffect, useState } from "react";
import "../components/Homepage.css";
import heroimg from "../components/img/heroimg.jpg";
import menu from "../components/img/menu.svg";
import { Link } from "react-router-dom";
import { FiTarget } from "react-icons/fi";
import { GoGoal } from "react-icons/go";
import { MdLightbulb } from "react-icons/md";
import { BsRocketTakeoffFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdMessage } from "react-icons/md";




const Homepage = () => {
  // Smooth scroll function
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // const courses = JSON.parse(localStorage.getItem("courses_detail")) || [];
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="home-main">
      {/* ── Navbar ── */}
      <div className="navbar">
        <div className="left">
          <h3>NexAcademy</h3>
        </div>
        <div className="right">
          <ul className="head">
            <li onClick={() => scrollTo("home")}>Home</li>
            <li onClick={() => scrollTo("about")}>About</li>
            <li onClick={() => scrollTo("courses")}>Courses</li>
            <li>
              <Link className="reg" to="/Studreg">
                Register
              </Link>
            </li>
            <li onClick={() => scrollTo("contact")}>Contact</li>
          </ul>
        </div>
        <div className="menu">
          <img src={menu} alt="menu" />
        </div>
      </div>

      {/* ── Hero Section ── */}
      {/* ── Hero Section ── */}
      <div className="hero-section" id="home">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-eyebrow">Welcome to NexAcademy</span>
            <h1 className="hero-title">
              Build Skills.
              <br />
              Build Careers.
            </h1>
            <p className="hero-sub">
              Hands-on training from industry mentors.
              <br />
              Real projects. Real results.
            </p>
            <div className="hero-btns">
              <Link to="/Studreg">
                <button className="hero-btn-primary">Enroll Now</button>
              </Link>
              <button
                className="hero-btn-outline"
                onClick={() => scrollTo("courses")}
              >
                View Courses
              </button>
            </div>

            <div className="staff-access">
              <p>Staff Access</p>
              <div className="staff-buttons">
                <Link to="/mentorlogin">
                  <button className="staff-btn">Mentor Login</button>
                </Link>
                <Link to="/adminlogin">
                  <button className="staff-btn">Admin Login</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── About Section ── */}
      <div className="about-section" id="about">
        <h2 className="section-title">About NexAcademy</h2>
        <p className="section-sub">
          Building careers through practical learning
        </p>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">
              <GoGoal />
            </div>
            <h4>Our Mission</h4>
            <p>
              To empower students with industry-ready technical skills through
              hands-on, project-based learning.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">
              <MdLightbulb />
            </div>
            <h4>Our Vision</h4>
            <p>
              To be the most trusted tech training institution transforming
              learners into skilled professionals.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">
              <BsRocketTakeoffFill />
            </div>
            <h4>Why Choose Us</h4>
            <p>
              Industry-experienced mentors, real-world projects, and dedicated
              career support for every student.
            </p>
          </div>
        </div>
      </div>

      {/* ── Courses Section ── */}
      <div className="courses-section" id="courses">
        <h2 className="section-title">Our Courses</h2>
        <p className="section-sub">
          Choose a course that fits your career goals
        </p>

        {courses.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--muted)" }}>
            Courses coming soon!
          </p>
        ) : (
          <div className="courses-grid">
            {courses.map((c) => (
              <div className="course-home-card" key={c.id}>
                <h4>{c.name}</h4>
                <p className="course-home-meta">
                  ⏱️ {c.duration} &nbsp; 💰 ₹{c.fee}
                </p>
                <p className="course-home-desc">{c.description}</p>
                <Link to="/Studreg">
                  <button className="course-home-btn">Enroll Now</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Contact Section ── */}
      <div className="contact-section" id="contact">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-sub">
          Have questions? We'd love to hear from you.
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">
              <FaLocationDot />
            </div>
            <div className="contact-label">Address</div>
            <div className="contact-value">
              123 Tech Street, Chennai, Tamil Nadu
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-label">Phone</div>
            <div className="contact-value">+91 98765 43210</div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">
              <MdMessage />
            </div>
            <div className="contact-label">Email</div>
            <div className="contact-value">info@nexacademy.com</div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>NexAcademy</h3>
            <p>Empowering students with industry-ready skills.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Quick Links</h4>
              <p onClick={() => scrollTo("home")}>Home</p>
              <p onClick={() => scrollTo("about")}>About</p>
              <p onClick={() => scrollTo("courses")}>Courses</p>
            </div>
            <div className="footer-col">
              <h4>For Students</h4>
              <Link to="/Studreg">
                <p>Register</p>
              </Link>
              <Link to="/studentlogin">
                <p>Login</p>
              </Link>
            </div>
            <div className="footer-col">
              <h4>Staff</h4>
              <Link to="/mentorlogin">
                <p>Mentor Login</p>
              </Link>
              <Link to="/adminlogin">
                <p>Admin Login</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 NexAcademy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

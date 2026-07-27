import React, { useEffect, useState } from "react";
import "../components/Homepage.css";
import menu from "../components/img/menu.svg";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { GoGoal } from "react-icons/go";
import { MdLightbulb } from "react-icons/md";
import { BsRocketTakeoffFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";

import { MdMessage } from "react-icons/md";
import { FaGraduationCap, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaGoogle, FaAmazon, FaMicrosoft, FaApple, FaFacebook, FaSalesforce, FaGithub, FaUber } from "react-icons/fa";




const courseThemes = [
  {
    gradient: "linear-gradient(135deg, #6C63FF, #A78BFA)",
    shadow: "rgba(108, 99, 255, 0.35)",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500"
  },
  {
    gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
    shadow: "rgba(255, 107, 107, 0.35)",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500"
  },
  {
    gradient: "linear-gradient(135deg, #10B981, #3B82F6)",
    shadow: "rgba(16, 185, 129, 0.35)",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500"
  },
  {
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    shadow: "rgba(245, 158, 11, 0.35)",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500"
  }
];

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scroll function
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // const courses = JSON.parse(localStorage.getItem("courses_detail")) || [];
  const [courses, setCourses] = useState([]);
  const [currTestimonial, setCurrTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Ananya Sharma",
      role: "Software Engineer",
      company: "Google",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      quote: "NexAcademy completely transformed my career path. The industry mentor support and project-based approach helped me secure a role at Google."
    },
    {
      name: "Rahul Verma",
      role: "Frontend Developer",
      company: "Amazon",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      quote: "The hands-on training here was top-notch. I went from coding basic HTML to building full-scale SaaS platforms in just a few months."
    },
    {
      name: "Priya Nair",
      role: "Full Stack Engineer",
      company: "Microsoft",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      quote: "I appreciated the post-course placement support the most. NexAcademy helped me prepare for technical interviews and build a standout portfolio."
    }
  ];

  const nextTestimonial = () => {
    setCurrTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.log(error));
  }, []);

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-main">
      {/* Background Motion Glow Blobs */}
      <div className="glow-blob blob-1"></div>
      <div className="glow-blob blob-2"></div>
      <div className="glow-blob blob-3"></div>

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
        <div className="menu" onClick={() => setMenuOpen(true)}>
          <img src={menu} alt="menu" />
        </div>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── Mobile Slide-In Drawer ── */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <h3>NexAcademy</h3>
          <button className="mobile-close-btn" onClick={() => setMenuOpen(false)}>
            <IoClose />
          </button>
        </div>
        <ul className="mobile-nav-list">
          <li onClick={() => scrollTo("home")}>Home</li>
          <li onClick={() => scrollTo("about")}>About</li>
          <li onClick={() => scrollTo("courses")}>Courses</li>
          <li onClick={() => scrollTo("contact")}>Contact</li>
          <li>
            <Link to="/Studreg" onClick={() => setMenuOpen(false)}>📝 Register</Link>
          </li>
          <li>
            <Link to="/studentlogin" onClick={() => setMenuOpen(false)}>🔐 Student Login</Link>
          </li>
        </ul>
        <div className="mobile-drawer-footer">
          <Link to="/mentorlogin" onClick={() => setMenuOpen(false)}>
            <button className="mobile-staff-btn">Mentor Login</button>
          </Link>
          <Link to="/adminlogin" onClick={() => setMenuOpen(false)}>
            <button className="mobile-staff-btn">Admin Login</button>
          </Link>
        </div>
      </div>

      {/* ── Hero Section ── */}
      {/* ── Hero Section ── */}
      <div className="hero-section" id="home">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-eyebrow animate-fade-in-down">Welcome to NexAcademy</span>
            <h1 className="hero-title animate-fade-in-up">
              Build Skills.
              <br />
              Build Careers.
            </h1>
            <p className="hero-sub animate-fade-in-up delay-1">
              Hands-on training from industry mentors.
              <br />
              Real projects. Real results.
            </p>
            <div className="hero-btns animate-fade-in-up delay-2">
              <Link to="/Studreg">
                <button className="hero-btn-primary">Enroll Now</button>
              </Link>
              <Link to="/studentlogin">
                <button className="hero-btn-outline">Student Login</button>
              </Link>
            </div>

            <div className="staff-access animate-fade-in-up delay-3">
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

      {/* ── Stats Section ── */}
      <div className="stats-section reveal-on-scroll">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>5,000+</h3>
            <p>Enrolled Students</p>
          </div>
          <div className="stat-card">
            <h3>95%</h3>
            <p>Placement Rate</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Expert Mentors</p>
          </div>
          <div className="stat-card">
            <h3>120+</h3>
            <p>Hiring Partners</p>
          </div>
        </div>
      </div>

      {/* ── About Section ── */}
      <div className="about-section reveal-on-scroll" id="about">
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
          <div className="about-card">
            <div className="about-icon">
              <FaGraduationCap />
            </div>
            <h4>Our Legacy</h4>
            <p>
              Founded to bridge the academic-industry gap, NexAcademy has emerged as a beacon of excellence, shaping careers for thousands of developers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* ── Courses Section ── */}
      <div className="courses-section reveal-on-scroll" id="courses">
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
            {courses.map((c, index) => {
              const theme = courseThemes[index % courseThemes.length];
              return (
                <div
                  className="course-home-card"
                  key={c.id}
                  style={{
                    "--theme-grad": theme.gradient,
                    "--theme-shadow": theme.shadow
                  }}
                >
                  <div className="course-card-banner">
                    <img src={theme.image} alt={c.name} className="course-banner-img" />
                    <div className="course-banner-overlay"></div>
                    <span className="course-badge">Featured</span>
                  </div>
                  <div className="course-card-content">
                    <h4>{c.name}</h4>
                    <div className="course-home-meta-grid">
                      <span className="meta-badge duration"><MdAccessTimeFilled /> {c.duration}</span>
                      <span className="meta-badge fee"><RiMoneyRupeeCircleFill /> ₹{c.fee}</span>
                    </div>
                    <p className="course-home-desc">{c.description}</p>
                    <Link to="/Studreg" className="enroll-link">
                      <button className="course-home-btn">Enroll Now</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Testimonials Section ── */}
      <div className="testimonials-section reveal-on-scroll" id="testimonials">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-sub">
          Hear from our alumni who transformed their careers
        </p>
        <div className="testimonials-container">
          <button className="carousel-btn prev" onClick={prevTestimonial}>
            <FaChevronLeft />
          </button>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img
                src={testimonials[currTestimonial].image}
                alt={testimonials[currTestimonial].name}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h4>{testimonials[currTestimonial].name}</h4>
                <p>
                  {testimonials[currTestimonial].role} at{" "}
                  <span className="company-name">
                    {testimonials[currTestimonial].company}
                  </span>
                </p>
              </div>
            </div>
            <div className="testimonial-body">
              <FaQuoteLeft className="quote-icon" />
              <p>"{testimonials[currTestimonial].quote}"</p>
            </div>
          </div>
          <button className="carousel-btn next" onClick={nextTestimonial}>
            <FaChevronRight />
          </button>
        </div>
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currTestimonial ? "active" : ""}`}
              onClick={() => setCurrTestimonial(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* ── Hiring Partners Section ── */}
      <div className="partners-section reveal-on-scroll">
        <h3 className="partners-title">Our Alumni Work at Leading Tech Companies</h3>
        <div className="partners-grid">
          <div className="partner-logo google">
            <FaGoogle className="partner-icon" /> <span>Google</span>
          </div>
          <div className="partner-logo amazon">
            <FaAmazon className="partner-icon" /> <span>Amazon</span>
          </div>
          <div className="partner-logo microsoft">
            <FaMicrosoft className="partner-icon" /> <span>Microsoft</span>
          </div>
          <div className="partner-logo apple">
            <FaApple className="partner-icon" /> <span>Apple</span>
          </div>
          <div className="partner-logo meta">
            <FaFacebook className="partner-icon" /> <span>Meta</span>
          </div>
          <div className="partner-logo salesforce">
            <FaSalesforce className="partner-icon" /> <span>Salesforce</span>
          </div>
          <div className="partner-logo github">
            <FaGithub className="partner-icon" /> <span>GitHub</span>
          </div>
          <div className="partner-logo uber">
            <FaUber className="partner-icon" /> <span>Uber</span>
          </div>
        </div>
      </div>

      {/* ── Contact Section ── */}
      <div className="contact-section reveal-on-scroll" id="contact">
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

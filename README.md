# 🚀 NexAcademy - Training Academy Management System

NexAcademy is a full-stack Training Academy Management Web Application built with **Spring Boot (Java 21)** and **React.js**.

---

## 🔑 System Default Credentials

### 🛡️ Admin Portal Credentials
- **Login URL**: `/adminlogin`
- **Email**: `admin@nexacademy.com`
- **Password**: `NexAdmin@2026`

---

## 🛠️ Technology Stack

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.x / Java 21
- **Database**: MySQL (`training_academy_db`)
- **Security**: Spring Security + BCrypt Hashing + JWT Authentication
- **Email/OTP**: Spring Boot Starter Mail (`smtp.gmail.com`)
- **Build Tool**: Maven (`mvnw`)

### Frontend (React.js)
- **Library**: React 19 + React Router v7
- **Styling**: Vanilla CSS (Glassmorphism + Dark Mode + Gradient Motion Orbs)
- **Notifications**: Custom Glassmorphic Toast Notification System

---

## 🚀 How to Run Locally

### 1. Database Setup
Create MySQL database:
```sql
CREATE DATABASE training_academy_db;
```

### 2. Backend Server
Navigate to the backend directory and run:
```bash
cd backendproject/training-academy-backend
.\mvnw.cmd spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

### 3. Frontend Web App
Navigate to the frontend directory and start dev server:
```bash
cd academy-frontend
npm start
```
*(Frontend runs on `http://localhost:3000`)*

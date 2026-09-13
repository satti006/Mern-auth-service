# 🚀 Week 6: Authentication, Authorization & Production Readiness

A secure RESTful API microservice built with **Node.js**, **Express**, and **MongoDB**. This project implements JWT authentication, Bcrypt password hashing, Role-Based Access Control (RBAC), and API hardening practices like rate limiting and HTTP security headers.

---

## 🛠️ Tech Stack & Tools

* **Backend Engine:** Node.js & Express.js
* **Database:** MongoDB Atlas (Mongoose ORM)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`) & Bcrypt (`bcryptjs`)
* **Security & Hardening:** `helmet`, `express-rate-limit`
* **API Testing:** Postman / Bruno

---

## ✨ Key Features

* **Secure User Registration & Login:** User password hashing using pre-save Mongoose middleware.
* **JWT Token Pipeline:** Issues signed JWT access tokens upon successful login.
* **Middleware Route Protection:** Custom `authenticate` middleware to verify Bearer tokens.
* **Role-Based Access Control (RBAC):** Custom `authorize(...roles)` middleware restricting administrative endpoints.
* **API Hardening:** Brute-force protection on authentication routes via rate limiting, plus HTTP security header protection via Helmet.

---

## 📁 Project Structure

```text
├── config/
│   └── db.js                 # Database connection setup
├── controllers/
│   └── authController.js     # Register, Login, Me logic
├── middleware/
│   ├── authMiddleware.js     # Token authentication & RBAC
│   └── rateLimiter.js        # Express rate limiting configuration
├── models/
│   └── User.js               # Mongoose schema with Bcrypt pre-save hook
├── routes/
│   └── authRoutes.js         # API endpoints
├── .env.example              # Environment variables template
├── server.js                 # Application entry point
└── package.json

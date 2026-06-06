# Store Rating Platform

A full-stack web application that allows users to submit ratings for registered stores. This project was developed as part of the Roxiler Systems coding challenge. It features a robust Role-Based Access Control (RBAC) system with tailored dashboards and functionalities for System Administrators, Store Owners, and Normal Users.

### 🌐 Live Demo
- **Frontend (Vercel):** [https://roxiler-store-rating-platform.vercel.app](https://roxiler-store-rating-platform.vercel.app)
- **Backend (Render):** Hosted on Render

### 🔑 Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `amol.budhwant@roxiler.com` | `password123` |
| Store Owner | `manager@cafegoodluck.in` | `password123` |
| Normal User | `rahul.deshmukh@gmail.com` | `password123` |

> You can also use the **Quick Access** buttons on the login page to instantly log in with any role.

---

## 💻 Tech Stack

- **Frontend:** React.js (Vite), React Router v6, Context API (for global auth state), Axios.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL managed via Prisma ORM.
- **Authentication:** JSON Web Tokens (JWT) stored securely in `HttpOnly` cookies.
- **Security:** `bcryptjs` for password hashing, robust backend validation.

---

##  Features & User Roles

The platform implements a single, unified login system that dynamically routes users to their specific dashboards based on their role:

### 1. System Administrator
- **Dashboard:** Overview of total users, total stores, and total ratings submitted platform-wide.
- **Management:** Can add new users (Admin, Normal User, or Store Owner) and register new stores.
- **Privileges:** Full visibility of all users and stores in the system.

### 2. Store Owner
- **Dashboard:** Displays their owned store's overall average rating and total number of ratings.
- **Insights:** Can view a detailed, sortable list of all users who have rated their specific store along with the individual ratings.

### 3. Normal User
- **Store Browsing:** Can view a sortable list of all stores registered on the platform.
- **Rating System:** Can submit a rating (1 to 5) for any store. Can also modify their previously submitted ratings.
- **Profile:** Can update their personal details (Name and Address).

---

## 🧠 Key Design Decisions

- **Security First:** Instead of storing JWTs in `localStorage` (which is vulnerable to XSS), the application sets the JWT in an `HttpOnly` cookie directly from the backend.
- **Service Layer Pattern:** The backend uses a Controller-Service architecture. Controllers handle HTTP requests, while Services handle the core business logic and database interactions. This ensures clean, maintainable, and testable code.
- **Responsive UI:** The frontend is built with pure, modern CSS using CSS Variables (Custom Properties) for consistent theming and a fully responsive grid layout that works seamlessly on both mobile and desktop.

---

*Developed independently by Amol Budhwant.*

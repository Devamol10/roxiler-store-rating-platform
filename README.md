# Store Rating Platform

A full-stack web application that allows users to submit ratings for registered stores. This project was developed as part of the Roxiler Systems coding challenge. It features a robust Role-Based Access Control (RBAC) system with tailored dashboards and functionalities for System Administrators, Store Owners, and Normal Users.

### 🌐 Live Demo
- **Frontend (Vercel):** [https://roxiler-store-rating-platform.vercel.app](https://roxiler-store-rating-platform.vercel.app)
- **Backend (Render):** Hosted on Render (Note: First API request might take 30-50 seconds as Render spins up the free tier server).

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

## 🛠️ Local Development Setup

Follow these instructions to run the project locally.

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/Devamol10/roxiler-store-rating-platform.git
cd roxiler-store-rating-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_db_name"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```
Run database migrations and start the server:
```bash
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```
Start the development server:
```bash
npm run dev
```

---

## 🧠 Key Design Decisions

- **Security First:** Instead of storing JWTs in `localStorage` (which is vulnerable to XSS), the application sets the JWT in an `HttpOnly` cookie directly from the backend.
- **Service Layer Pattern:** The backend uses a Controller-Service architecture. Controllers handle HTTP requests, while Services handle the core business logic and database interactions. This ensures clean, maintainable, and testable code.
- **Responsive UI:** The frontend is built with pure, modern CSS using CSS Variables (Custom Properties) for consistent theming and a fully responsive grid layout that works seamlessly on both mobile and desktop.

---

*Developed independently by Amol Budhwant.*

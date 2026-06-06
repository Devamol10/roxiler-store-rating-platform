# Roxiler Store Rating Platform

A full-stack web application that allows users to submit ratings for registered stores. Built with React (Frontend), Express.js (Backend), and PostgreSQL (via Prisma).

## Project Structure
- `/frontend` - React application built with Vite
- `/backend` - Express.js REST API

## Running Locally

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure your .env file with DATABASE_URL and JWT_SECRET
   npx prisma migrate dev
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Configure your .env file with VITE_API_BASE_URL (defaults to http://localhost:5000/api)
   npm run dev
   ```

## User Roles & Registration Flow

This application operates using three distinct user roles, adhering strictly to the security and functional requirements:

### 1. Normal User (Role: `USER`)
- **How to get this role:** Anyone can register directly via the public `/signup` page. The system automatically assigns the `USER` role to all accounts created this way.
- **Capabilities:** Can search for stores, view store details, submit ratings (1 to 5), and update their password.

### 2. Store Owner (Role: `STORE_OWNER`)
- **How to get this role:** Cannot be registered publicly. A System Administrator must log into the Admin Dashboard and manually create a new account, explicitly assigning the `STORE_OWNER` role from the dropdown menu.
- **Capabilities:** Has a dedicated dashboard to view the average rating of their stores and a detailed list of all users who have submitted ratings for them.

### 3. System Administrator (Role: `ADMIN`)
- **How to get this role:** Like Store Owners, new System Administrators can only be created by an existing System Administrator from the Admin Dashboard.
- **Capabilities:** Has full system access. Can view overall statistics, manage (add/view) stores, and create new users across any of the three roles.

## Features
- **Strict Validations:** Names (20-60 chars), Addresses (max 400 chars), Passwords (8-16 chars, 1 uppercase, 1 special).
- **Dynamic Sorting:** All tables (Admin Users, Admin Stores, Store Ratings, and Normal User Store Directories) support multi-field sorting in both Ascending and Descending orders.
- **Role-Based Routing:** Strict frontend and backend route protection ensures users can only access their respective dashboards.

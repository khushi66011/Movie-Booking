# 🎬 IMovies - Full-Stack MERN Cinema Ticket Booking Web Application

**IMovies** is a full-stack cinema ticket booking web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Bootstrap 5. It features real-time movie search, live Indian Standard Time (IST) clock, an interactive 40-seat cinema matrix with Standard (₹250) & VIP (₹450) tiers, live seat locking, real-time 18% GST calculation, printable digital QR e-tickets, and user booking history.

---

## 📁 Project Architecture & Folder Structure

```text
IMovies/
├── client/                                  # React Frontend Application
│   ├── public/
│   │   └── index.html                       # HTML5 template with Bootstrap 5 & Google Fonts
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx                # JWT Login & Register modal with demo fill
│   │   │   ├── BookingHistory.jsx           # Past bookings list & e-ticket viewer
│   │   │   ├── CheckoutModal.jsx            # Order breakdown, 18% GST & success notification
│   │   │   ├── DigitalTicket.jsx            # Printable cinema e-ticket with barcode & QR
│   │   │   ├── LiveClock.jsx                # Live Indian Standard Time (IST) ticking clock
│   │   │   ├── MovieCard.jsx                # Individual movie card with rating & pricing
│   │   │   ├── MovieGrid.jsx                # Responsive catalog grid with skeleton states
│   │   │   ├── Navbar.jsx                   # Sticky header with brand, IST clock & auth
│   │   │   ├── QRCodeComponent.jsx          # Self-contained SVG QR code generator
│   │   │   ├── SearchFilter.jsx             # Real-time search & genre filter pills
│   │   │   └── SeatMatrixModal.jsx          # Dynamic screen representation & 5x8 seat grid
│   │   ├── context/
│   │   │   └── AuthContext.js               # Global JWT Auth state & methods
│   │   ├── services/
│   │   │   └── api.js                       # Centralized API fetcher with token headers
│   │   ├── App.css                          # Dark cinema theme, seat styles & print media
│   │   ├── App.js                           # Routing & booking state orchestrator
│   │   ├── index.css                        # Base typography and resets
│   │   └── index.js                         # React DOM mount point
│   └── package.json                         # Client dependencies (React 18, Bootstrap 5)
│
├── server/                                  # Express Backend & REST API
│   ├── config/
│   │   └── db.js                            # MongoDB Mongoose connection handler
│   ├── middleware/
│   │   └── auth.js                          # JWT verification & route protection
│   ├── models/
│   │   ├── Booking.js                       # Booking schema (Seats, GST, Total, QR payload)
│   │   ├── Movie.js                         # Movie schema (Showtimes, Hall, ₹250/₹450 pricing)
│   │   └── User.js                          # User schema with bcryptjs password hashing
│   ├── routes/
│   │   ├── auth.js                          # POST /register, POST /login, GET /me
│   │   ├── bookings.js                      # POST /bookings, GET /my-bookings, GET /occupied-seats
│   │   └── movies.js                        # GET /movies (search & genre), GET /movies/:id
│   ├── .env                                 # Environment variables (MongoDB URI & JWT Secret)
│   ├── .env.example                         # Environment template
│   ├── package.json                         # Backend dependencies (Express, Mongoose, JWT)
│   ├── seed.js                              # Database seeder with sample movies & demo user
│   └── server.js                            # Express server entry point & auto-seeder
│
└── package.json                             # Root package with multi-process scripts
```

---

## ⚡ Key Functional Requirements Implemented

1. **User Authentication**:
   - Secure registration and login using **JSON Web Tokens (JWT)** and **bcryptjs** password hashing (10 salt rounds).
   - Protected routes for creating bookings and viewing past user bookings.
   - Demo account pre-fill button: `guest@imovies.com` / `Password123!`.

2. **Movie Catalog with Real-Time Search & IST Clock**:
   - Real-time instant search by movie title, synopsis, or language.
   - Filter pills for genres: `All`, `Sci-Fi`, `Action`, `Adventure`, `Thriller`, `Drama`, `Comedy`.
   - Prices clearly displayed in Indian Rupees: **Standard ₹250** and **VIP ₹450**.
   - **Live IST Clock**: Displays current Indian Standard Time (`Asia/Kolkata`) ticking second-by-second with date and status indicator.

3. **Interactive Seat Matrix**:
   - Curved cinema screen representation with realistic ambient light glow (`ALL EYES THIS WAY • CINEMA SCREEN`).
   - 5 Rows: **A to E**, 8 Columns: **1 to 8** (total 40 seats) with a center aisle separation.
   - **VIP Tier**: Rows **A & B** (₹450 each, luxury gold accent).
   - **Standard Tier**: Rows **C, D, E** (₹250 each, silver-blue accent).
   - **Real-Time Seat Locking**: Fetches occupied seats for the selected movie, date, and showtime from `/api/bookings/occupied-seats`. Reserved seats are locked with a lock icon and cannot be booked concurrently.

4. **Checkout & Exact Confirmation**:
   - Real-time calculation:
     $$\text{Subtotal} = \sum \text{Seat Prices}$$
     $$\text{GST (18\%)} = \text{Subtotal} \times 0.18$$
     $$\text{Total Amount} = \text{Subtotal} + \text{GST Amount}$$
   - Displays payment simulations (UPI, Credit/Debit Card, Net Banking).
   - Displays exact required confirmation message:
     > **"Congratulations! Your ticket has been booked."**
   - Renders a digital printable e-ticket with a high-resolution QR code, perforated cinema edges, and receipt breakdown.
   - Print-ready format via `@media print` (hides navbars/backgrounds and formats cleanly for A4/receipt).

5. **Booking History**:
   - Dedicated UI (`/my-bookings`) displaying all past confirmed bookings for the logged-in user.
   - Includes movie poster, date, IST showtime, seat numbers, total amount in ₹, and a **"View E-Ticket"** button to re-inspect or print anytime.

---

## 🛠️ Step-by-Step Setup Guide

### 1. MongoDB Atlas Configuration
In `IMovies/server/.env`, insert your MongoDB Atlas database password in place of `<db_password>`:

```env
PORT=5000
MONGO_URI=mongodb+srv://bhawsarkhushi983_db_user:<YOUR_PASSWORD_HERE>@cluster0.kxgvvnn.mongodb.net/imovies?retryWrites=true&w=majority
JWT_SECRET=imovies_super_secure_jwt_secret_key_2026_cinema_booking_app
NODE_ENV=development
```

*(Note: If you are working offline or without internet, you can set `MONGO_URI=mongodb://127.0.0.1:27017/imovies`)*.

---

### 2. Backend Setup & Run

Open a terminal and navigate to `IMovies/server`:
```bash
cd IMovies/server
npm install
npm run seed     # (Optional) Pre-populates blockbuster movies & demo bookings
npm run dev      # Starts the Express API server on http://localhost:5000
```

> **Note**: `server.js` also has built-in auto-seeding. If the database collection is empty, it will automatically populate sample movies upon starting!

---

### 3. Frontend Setup & Run

Open a second terminal and navigate to `IMovies/client`:
```bash
cd IMovies/client
npm install
npm start        # Launches the React application on http://localhost:3000
```

---

## 📡 API Reference Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with name, email, password | Public |
| `POST` | `/api/auth/login` | Authenticate with email/password, returns JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Private (Bearer JWT) |
| `GET` | `/api/movies` | Fetch movies with optional `?search=` and `?genre=` | Public |
| `GET` | `/api/movies/:id` | Fetch single movie details | Public |
| `GET` | `/api/bookings/occupied-seats` | Get locked/occupied seat IDs for `movieId`, `date`, `time` | Public |
| `POST` | `/api/bookings` | Book seats, check concurrency, calculate 18% GST | Private (Bearer JWT) |
| `GET` | `/api/bookings/my-bookings` | List all past confirmed bookings for user | Private (Bearer JWT) |
| `GET` | `/api/bookings/:id` | Get specific booking e-ticket | Private (Bearer JWT) |

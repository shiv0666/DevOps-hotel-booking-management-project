# DevOps Project — Hotel Booking Management

> A simple hotel booking application with separate `backend` (Node/Express/MongoDB) and `frontend` (React + Vite) folders.

**Features**
- **User auth:** signup / login with JWT
- **Hotels:** create, list, update, delete hotels (admin/staff flows).
- **Bookings:** create and view bookings per user.

**Tech Stack**
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite
- Auth: JSON Web Tokens (JWT)

**Repository structure**
- `backend/` — API server and models
- `frontend/` — React app

**Prerequisites**
- Node.js v16+ and npm
- MongoDB instance (local or cloud)

**Environment variables**
Create a `.env` in `backend/` with at minimum:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `PORT` — (optional) server port, default 5000

Example `.env` (do NOT commit real secrets):

```
MONGO_URI=mongodb+srv://user:password@cluster0.mongodb.net/hotel
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Install & Run**

Backend

```bash
cd backend
npm install
# create .env with required variables
npm run dev    # runs nodemon server.js
```

Frontend

```bash
cd frontend
npm install
npm run dev    # starts Vite dev server
```

**Available scripts**
- Backend: `start` (node server.js), `dev` (nodemon server.js)
- Frontend: `dev`, `build`, `preview`

**API overview**
The backend exposes REST endpoints (see `backend/routes/`):

- `routes/authRoutes.js` — authentication (signup, login)
- `routes/hotelRoutes.js` — hotels CRUD
- `routes/bookingRoutes.js` — bookings CRUD

Inspect the files under `backend/controllers/` for detailed behavior.

**Developing**
- Run backend and frontend concurrently in separate terminals.
- Use Postman or the frontend UI to exercise endpoints.

**Commit & Push**
This repo is already connected to a GitHub remote. After editing files, run:

```bash
git add .
git commit -m "Your message"
git push
```




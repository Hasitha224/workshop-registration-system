# Workshop Registration Service

A full stack app for a community training centre to manage workshops and attendee registrations. Staff register and cancel attendees, managers schedule workshops, and admins manage staff accounts. A workshop can never hold more active registrations than its capacity, even when many staff register people at the same moment.

**Stack:** React + TypeScript (frontend), Node.js + Express + TypeScript (backend), MongoDB + Mongoose (database), JWT authentication, Zod validation.

---

## Project structure

```
workshop-app/
  server/    Express API (TypeScript, Mongoose)
  client/    React frontend (TypeScript, Vite)
  README.md

```

---

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

---

## Setup and run

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit values if needed
npm run seed              # creates users and sample workshops
npm run dev               # API on http://localhost:3001
```

**`server/.env.example`**

```
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/workshop_db
JWT_SECRET=change-me-dev-only
CORS_ORIGIN=http://localhost:5173
JWT_EXPIRES_IN='24h'
```

> Use the exact variable names from your `config/env.ts`. If your Mongo variable is not `MONGODB_URI`, change it here.

Health check: `GET http://localhost:3001/api/v1/health`

### 2. Frontend

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend on port 3001, so no extra frontend configuration is needed.

---

## Seeded logins (development only)

`npm run seed` wipes the users, workshops and registrations collections and recreates them.

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin123! |
| Manager | manager@example.com | Manager123! |
| Staff | staff@example.com | Staff123! |

Sample data: 6 workshops in different states (open, draft, completed). `FIT-110` (Saturday Bootcamp) has 5 seats with 4 taken and one cancelled registration, so you can try the "last seat" behaviour and the history view straight away.

---

## Roles and permissions

There is no public signup. The first Admin is seeded, and Admins create every other account.

| Action | Admin | Manager | Staff |
|---|---|---|---|
| Create user accounts and set roles | Yes | No | No |
| Add and edit workshops | No | Yes | No |
| Register and cancel attendees | No | Yes | Yes |
| View workshops, registrations and history | No | Yes | Yes |

Permissions are enforced by the backend on every request (`authenticate` and `requireRole` middleware). The role is read from the database on each request, not trusted from the token, so a demoted or deactivated user loses access immediately. Hiding buttons in the UI is only a convenience.

The table follows the brief literally, so Admin accounts cannot view workshops.

---

## API overview

Base URL: `http://localhost:3001/api/v1`. Send `Authorization: Bearer <token>` on every route except login.

| Method | Path | Roles | Purpose |
|---|---|---|---|
| POST | `/auth/login` | public | Log in, returns a token |
| GET | `/auth/me` | any logged-in user | Current user |
| POST | `/users` | admin | Create a user |
| GET | `/users` | admin | List users |
| PATCH | `/users/:id` | admin | Change name, role, active flag, or reset password |
| GET | `/workshops` | manager, staff | List and search workshops |
| POST | `/workshops` | manager | Create a workshop |
| GET | `/workshops/:id` | manager, staff | Get one workshop |
| PATCH | `/workshops/:id` | manager | Edit a workshop |
| GET | `/workshops/:id/registrations` | manager, staff | Full history, including cancelled |
| POST | `/workshops/:id/registrations` | manager, staff | Register an attendee |
| POST | `/registrations/:id/cancel` | manager, staff | Cancel a registration (never deleted) |

### Finding workshops

`GET /workshops?from=2026-10-12&to=2026-10-18&status=open&hasSeats=true`

- `from`, `to`: date range on the start time (a date-only `to` includes the whole day)
- `status`: `draft`, `open`, `cancelled` or `completed`
- `hasSeats=true`: only workshops with seats still available

Each workshop in the response includes `seatsLeft`.

---

## How over-registration is prevented

Registering does not "count, then insert", because two simultaneous requests could both pass the count. Instead, each workshop stores an `activeCount`, and a seat is claimed with a single atomic conditional update:

```
findOneAndUpdate(
  { _id, status: "open", startsAt > now, activeCount < capacity },
  { $inc: { activeCount: 1 } }
)
```

MongoDB applies a single-document update atomically, so only one request can win the last seat; the others get a 409 "workshop is full". If the registration record then fails to save, the seat is given back.

Other protections:

- Cancelling only flips a registration from `active` to `cancelled` once, so a double click cannot free two seats.
- A partial unique index on `(workshopId, attendeeEmail)` where `status = "active"` stops the same person being registered twice, while still allowing re-registration after a cancellation.
- Capacity can only be edited down to the number of seats already taken, checked in the same atomic update.
- Registrations are never deleted. Every record keeps who registered it, who cancelled it, and when.

### Concurrency test

If you add the script `server/src/scripts/concurrency-test.ts`, run it with the server running:

```bash
npm run seed
npx tsx src/scripts/concurrency-test.ts
```

It fires 20 parallel registrations at `FIT-110` (one seat left). Expected result: exactly 1 succeeds and 19 are rejected.

---

## Assumptions

- An attendee is only a name and an email typed in by staff; attendees have no accounts.
- One active registration per email per workshop.
- Workshop times are stored in UTC.
- Registration is only allowed for workshops that are `open` and have not started yet.

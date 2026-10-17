<div align="center">

# REP / TRACK

### Every rep counts.

Track your pull-ups. Build your streak. See your progress.

A full-stack workout tracker built with **React · TypeScript · Express · MongoDB**.

<br />

<img src="https://img.shields.io/badge/React-18181B?style=for-the-badge&amp;logo=react&amp;logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-18181B?style=for-the-badge&amp;logo=typescript&amp;logoColor=3178C6" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-18181B?style=for-the-badge&amp;logo=vite&amp;logoColor=646CFF" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind_CSS-18181B?style=for-the-badge&amp;logo=tailwindcss&amp;logoColor=38BDF8" alt="Tailwind CSS" />

<br />

<img src="https://img.shields.io/badge/Node.js-18181B?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=A3E635" alt="Node.js" />
<img src="https://img.shields.io/badge/Express-18181B?style=for-the-badge&amp;logo=express&amp;logoColor=FFFFFF" alt="Express" />
<img src="https://img.shields.io/badge/MongoDB-18181B?style=for-the-badge&amp;logo=mongodb&amp;logoColor=A3E635" alt="MongoDB" />

<br />
<br />

[Features](#features) &nbsp; · &nbsp; [Quick start](#quick-start) &nbsp; · &nbsp; [Deployment](#deployment) &nbsp; · &nbsp; [Pages](#pages) &nbsp; · &nbsp; [API reference](#api-reference)

</div>

---

## Overview

**REP / TRACK** brings active workouts, training history, progress charts, and personal records into one responsive dark interface. Record a set, finish a workout, and review how your training volume changes over time.
[🚀 Live Demo](https://puliuptracker.netlify.app/)

## Features

<table>
<tr>
<td width="50%" valign="top">
<h3>💪 Record your workout</h3>
<p>Add sets, edit repetitions, and confirm deletions. Your first set starts a workout automatically; finish it when you are done.</p>
</td>
<td width="50%" valign="top">
<h3>📊 See your progress</h3>
<p>Explore training volume over 7, 30, or 90 days. Review monthly repetitions, your best set, and completed workouts.</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>🗓️ Review your history</h3>
<p>Expand completed workouts to see sets, repetitions, and duration. Filter by this month or your three highest-volume workouts.</p>
</td>
<td width="50%" valign="top">
<h3>🏆 Track personal records</h3>
<p>Find your best set, highest-volume workout, most sets in a workout, and longest training streak.</p>
</td>
</tr>
</table>

**Built around everyday use:** registration and sign-in, desktop and mobile navigation, loading and empty states, network error messages, and automatic sign-in redirection after a protected request returns `401`.

---

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Charts | Recharts |
| API requests | Fetch API and a shared `authFetch` helper |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Code quality | ESLint, Prettier |


## Quick start

### Before you begin

- Node.js **22.13.0 or later within the 22.x release line**, or **24.0.0 or later**. These versions satisfy the Node.js engine requirements of the locked Vite, ESLint, and Mongoose dependencies.
- npm.
- A running MongoDB instance, local or hosted.

### 01 · Clone

```bash
git clone https://github.com/D1gger1/Pullup_Tracker.git
cd Pullup_Tracker
```

### 02 · Install

Install the backend dependencies from the repository root:

```bash
npm ci
```

Then install the frontend dependencies:

```bash
cd client
npm ci
cd ..
```

### 03 · Configure

Create a `.env` file in the repository root:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/pullup_tracker
JWT_SECRET=replace_with_a_random_secret
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify authentication tokens |
| `PORT` | No | Port the API listens on. Defaults to `3000`; hosting platforms usually set it automatically |

The MongoDB URL above is a local example. Replace it with your connection string if using a hosted database.

Generate a random JWT secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the result into `JWT_SECRET`. Keep your `.env` file private; it is excluded by the repository's `.gitignore`.

### 04 · Start the API

From the repository root:

```bash
node index.js
```

The API listens on the port from the `PORT` environment variable and falls back to `3000` when it is not set. The development proxy in the next step expects port `3000`, so leave `PORT` unset for local development.

### 05 · Start the app

Open a second terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite. During development, Vite forwards `/api` requests to `http://localhost:3000` through the proxy in `client/vite.config.ts`.

Create an account, sign in, and add your first pull-up set.

---

## Frontend commands

Run these commands from `client`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Run the TypeScript build check and generate the production bundle in `client/dist` |
| `npm run preview` | Preview the generated frontend bundle locally |
| `npm run lint` | Run ESLint |
| `npm run format:check` | Check formatting with Prettier |
| `npm run format` | Format files with Prettier |

## Deployment

The live demo runs as two separate services:

| Part | Hosting | What runs there |
| --- | --- | --- |
| Frontend | Netlify | Static bundle built from `client` with `npm run build` (output in `client/dist`) |
| Backend | Render | Express API started with `node index.js`, connected to a hosted MongoDB database |

The frontend always calls relative `/api/...` URLs. In development, the Vite proxy forwards them to `localhost:3000`. In production, [`client/public/_redirects`](client/public/_redirects) does the same job on Netlify:

```text
/api/*  https://pullup-tracker-api.onrender.com/api/:splat  200
/*      /index.html                                          200
```

- **First rule:** requests to `/api/*` are proxied to the backend. Status `200` makes this a rewrite rather than a redirect, so the browser keeps talking to the frontend's own domain and no CORS configuration is needed.
- **Second rule:** every other path serves `index.html`, so reloading a page such as `/history` lets React Router handle the route instead of returning a 404.

Environment variables for the backend host:

| Variable | Notes |
| --- | --- |
| `MONGODB_URI` | Connection string of the hosted MongoDB database |
| `JWT_SECRET` | A long random value, different from the local one |
| `PORT` | Provided by the hosting platform, no need to set it manually |

> **Note**
>
> If the backend runs on a free hosting tier, the first request after a period of inactivity may take noticeably longer while the service wakes up.

## Pages

| Route | Page |
| --- | --- |
| `/auth` | Registration and sign-in |
| `/` | Workout overview and active workout |
| `/history` | Completed workouts |
| `/progress` | Training volume chart |
| `/records` | Personal records |

---

## API reference

Registration and sign-in are public. All other endpoints below require the following header:

```http
Authorization: Bearer <token>
```

<details>
<summary><strong>View all endpoints</strong></summary>

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register with `name`, `email`, and `password` |
| `POST` | `/api/auth/login` | Sign in with `email` and `password`; receive a JWT |
| `POST` | `/api/pullups` | Add a set with `{ "reps": 5 }` |
| `PATCH` | `/api/pullups/:id` | Update repetitions with `{ "reps": 7 }` |
| `DELETE` | `/api/pullups/:id` | Delete a set |
| `GET` | `/api/workouts/current` | Retrieve the active workout and its sets |
| `PATCH` | `/api/workouts/:id/finish` | Finish an active workout |
| `GET` | `/api/workouts` | Retrieve completed workouts |
| `GET` | `/api/pullups/stats/streak` | Retrieve the current training streak |
| `GET` | `/api/pullups/stats/summary` | Retrieve overview statistics |
| `GET` | `/api/pullups/stats/progress?period=month` | Retrieve chart data; accepts `week`, `month`, or `threeMonths` |
| `GET` | `/api/pullups/stats/records` | Retrieve personal records |

</details>

## Implementation notes

<details>
<summary><strong>Authentication, statistics, and date handling</strong></summary>

- The JWT expires after one hour and is stored in `localStorage` under `pullupTrackerToken`. The shared [`authFetch`](client/src/api/authFetch.ts) helper attaches it to protected requests, removes it on a `401` response, and redirects to `/auth`.
- Passwords are hashed with bcryptjs before storage in MongoDB.
- Set creation, updates, and deletion are scoped to the authenticated user's ID.
- Repetitions must be a positive integer.
- The progress chart uses rolling 7-, 30-, and 90-day periods. The overview's monthly total and history's month filter use the current calendar month.
- The current and longest streaks are both based on days with recorded sets.
- Backend day boundaries use the server's local time zone. Displayed dates and times use the browser's local time zone.

</details>

## Project structure

| Path | Contents |
| --- | --- |
| `client/src/api/` | Shared authenticated request helper |
| `client/src/pages/` | Authentication, overview, history, progress, and records pages |
| `client/src/components/` | Layout, navigation, workout cards, forms, and chart |
| `client/src/types/` | TypeScript types for API data |
| `client/public/_redirects` | Netlify rules: API proxy and single-page-app fallback |
| `config/` | Database connection |
| `controllers/` | Authentication, set, workout, and statistics logic |
| `middleware/` | JWT verification |
| `models/` | User, workout, and pull-up set schemas |
| `routes/` | Express API routes |
| `index.js` | Backend entry point |

---

<div align="center">

**REP / TRACK** · Every rep counts.

Built by [Max Kotlin](https://github.com/D1gger1)

[Explore the code](https://github.com/D1gger1/Pullup_Tracker) · [Report an issue](https://github.com/D1gger1/Pullup_Tracker/issues)

</div>

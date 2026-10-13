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

[Features](#features) &nbsp; · &nbsp; [Quick start](#quick-start) &nbsp; · &nbsp; [Pages](#pages) &nbsp; · &nbsp; [API reference](#api-reference)

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

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |

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

The API runs at `http://localhost:3000`. The port is currently set in `index.js`.

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

> **Deployment note**
>
> The API proxy is configured for development. For production or a fully functional build preview, route `/api` to the backend through the hosting server or configure a suitable API base URL and cross-origin access. A production deployment configuration is not yet included.

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
| `GET` | `/api/pullups` | Retrieve the signed-in user's sets |
| `PATCH` | `/api/pullups/:id` | Update repetitions with `{ "reps": 7 }` |
| `DELETE` | `/api/pullups/:id` | Delete a set |
| `GET` | `/api/workouts/current` | Retrieve the active workout and its sets |
| `PATCH` | `/api/workouts/:id/finish` | Finish an active workout |
| `GET` | `/api/workouts` | Retrieve completed workouts |
| `GET` | `/api/pullups/stats/daily` | Retrieve today's sets and total repetitions |
| `GET` | `/api/pullups/stats/weekly` | Retrieve the current calendar week's statistics |
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
- The current streak is based on days with recorded sets; the longest streak is based on the start dates of completed workouts.
- Backend day boundaries use the server's local time zone. Displayed dates and times use the browser's local time zone.

</details>

## Project structure

| Path | Contents |
| --- | --- |
| `client/src/api/` | Shared authenticated request helper |
| `client/src/pages/` | Authentication, overview, history, progress, and records pages |
| `client/src/components/` | Layout, navigation, workout cards, forms, and chart |
| `client/src/types/` | TypeScript types for API data |
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

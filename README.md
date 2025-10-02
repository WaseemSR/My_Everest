# My Everest 

Overview
- My Everest helps you define big personal goals (“Everests”), break them down into milestones, and share progress. It includes a public feed, individual Everest pages with comments, and a profile where you can edit your username and bio.

Features
- JWT auth: signup, login
- Create, edit, delete Everests
- Milestones with completion status and optional dates
- Comments on Everests
- Profile page with editable username and bio
- Seed script for demo data

Tech Stack
- Frontend: React (Vite), React Router, Bulma
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB

Repo Structure
- `frontend/` — Vite + React application
- `api/` — Express API + Mongoose models
- `frontend/public/` — static assets (images, video)

Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

Environment Variables
- Backend (`api/.env`)
  - `MONGODB_URL` — Mongo connection string
  - `JWT_SECRET` — secret used to sign tokens
  - `PORT` — optional, defaults to 3000
- Frontend (`frontend/.env`)
  - `VITE_BACKEND_URL` — e.g. `http://localhost:3000`

Setup
1) Backend
```
cd api
npm install
cp .env

MONGODB_URL="mongodb://0.0.0.0/myeverest"
NODE_ENV="development"
JWT_SECRET="secret"
```
2) Frontend
```
cd frontend
npm install
cp .env

VITE_BACKEND_URL="http://localhost:3000"
```

Run
- Backend (Express):
```
cd api
npm run dev   # reloads on changes
# or: npm start
```
- Frontend (Vite):
```
cd frontend
npm run dev
# Open the shown URL (http://localhost:5173)
```

Seeding Demo Data
```
cd api
npm run seed
```
This clears users/everests and inserts fresh demo data.

Testing
- Backend:
```
cd api
npm test
```
- Frontend:
```
cd frontend
npm test
```

Key API Endpoints (brief)
- Auth
  - `POST /tokens` — login → { token }
  - `GET /tokens/check-username?username=` — check username availability
- Users
  - `POST /users` — signup
  - `GET /users/profile` — current user (JWT)
  - `PATCH /users/:id` — update username/bio (JWT; only self)
  - `GET /users/:userId/everests` — fetch a user’s Everests (JWT)
- Everests
  - `GET /everests` — all (feed)
  - `POST /everests` — create
  - `GET /everests/:id` — by id
  - `PATCH /everests/:id` — update (owner)
  - `DELETE /everests/:id` — delete (owner)
  - `POST /everests/:everestId/milestones` — add milestone (owner)
  - `PATCH /everests/:everestId/milestones/:milestoneId` — toggle complete (owner)
- Comments
  - `GET /everests/:id/comments` — list
  - `POST /everests/:id/comments` — add (JWT)

Frontend Pages
- Feed: `frontend/src/pages/Feed/FeedPage.jsx`
- Profile (with edit modal): `frontend/src/pages/Profile/ProfilePage.jsx`
- Everest details + milestones + comments: `frontend/src/pages/Everest/EverestPage.jsx`
- Signup (username availability check): `frontend/src/pages/Signup/SignupPage.jsx`
- About (alternating text/images): `frontend/src/pages/About/AboutPage.jsx`

Implementation Notes
- Username (not fullName): The model and UI use `username`. Components and seeds were updated accordingly.
- Milestones: Support an optional `date` field. New milestone form includes a date picker; dates display in `en-GB` format in the UI.
- Assets: Some filenames in `frontend/public/` include spaces (e.g., `Mount-Everest .png`, `Marathon 2.png`). Paths must match exactly.

Troubleshooting
- 401 errors from API: ensure the frontend sends `Authorization: Bearer <token>` and you’re logged in.
- Seed error (author undefined): the seed script matches Everests to users by username case-insensitively. Ensure usernames align.
- Images not showing: verify filename spelling/spaces; consider renaming to remove spaces and update imports accordingly.

Deployment
- Backend: set `MONGODB_URL`, `JWT_SECRET`, and run `npm start` in `api/`.
- Frontend: run `npm run build` in `frontend/` and serve `frontend/dist`. Set `VITE_BACKEND_URL` at build time.

License
- Add your chosen license here.


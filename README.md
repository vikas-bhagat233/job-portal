Job Portal (MERN)

Overview
- Full-stack job portal with role-based access (recruiter/candidate), JWT auth, jobs/applications, file uploads, hiring workflow, and seat limits.
- Frontend: React (CRA), react-router-dom, axios with auth interceptors and a glassmorphism UI.
- Backend: Node.js/Express, MongoDB/Mongoose, JWT, Multer for uploads.

Features
- Recruiters: post jobs, set seat limits, view/manage applications, mark viewed, reject, shortlist, hire. Auto-close jobs when seats are filled; can manually close/open.
- Candidates: browse open jobs, search, view details, apply with resume and cover letter, see application status and when it’s viewed.
- Security: role-based protections and ownership checks.

Getting Started
1) Prereqs: Node 18+, MongoDB connection string
2) Backend env (create backend/.env):
	 MONGO_URI=mongodb+srv://...
	 JWT_SECRET=supersecret
3) Frontend env (optional):
	 REACT_APP_API=http://localhost:5000/api

Install & Run
- Backend
	cd backend
	npm install
	npm start

- Frontend
	cd frontend
	npm install
	npm start

Auth
- Register/login returns token; token is stored in localStorage and attached via axios interceptor.

Notes
- Uploads are stored under backend/uploads (served at /uploads). .gitignore excludes uploaded files.
- Seats: setting seats=0 closes a job; hiring decrements remainingSeats and auto-closes at 0.

License
MIT

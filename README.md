# CrowdSolve Platform

CrowdSolve is a full-stack web application for community-driven problem reporting and solution sharing. Users can report local problems, suggest solutions, upvote solutions, and discuss via comments.
## Demo

You can try the live demo at [https://crowdsolve-platform-jp41.onrender.com](https://crowdsolve-platform-jp41.onrender.com).

## Project Structure

```
crowdsolve-platform/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    ├── public/
    ├── .env.example
    ├── package.json
    └── index.html
```

---

## Backend

### Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)
- Joi (validation)

### Features

- User authentication (signup, login, logout, get profile)
- Problem CRUD (report, list, view, delete)
- Solution CRUD (suggest, upvote, comment)
- Image uploads for problems
- Rate limiting, CORS, error handling

### Installation

1. **Clone the repo:**
   ```sh
   git clone [<repo-url>](https://github.com/moohiit/crowdsolve-platform.git)
   cd crowdsolve-platform/backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.

4. **Start the server:**
   ```sh
   npm run dev
   ```
   - Server runs on `http://localhost:5000` by default.

### API Endpoints

- **Auth:** `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Problems:** `/api/problems` (list, create), `/api/problems/:id` (view, delete), `/api/problems/user/my-problems` (user's problems)
- **Solutions:** `/api/solutions/:problemId` (create), `/api/solutions/:id/upvote` (upvote), `/api/solutions/:solutionId/comments` (comment, list)

---

## Frontend

### Tech Stack

- React (with Vite)
- Redux Toolkit
- React Router
- Tailwind CSS

### Features

- Auth pages (login, signup)
- Problem list, detail, create, and user's problems
- Solution list, create, upvote, comment
- Responsive UI with glassmorphism and gradient backgrounds

### Installation

1. **Navigate to frontend:**
   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set `VITE_BACKEND_URL` if needed.

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   - App runs on `http://localhost:5173` by default.

### Usage

- **Login/Signup:** Create an account or log in.
- **Report Problem:** Use "Report Problem" to submit a new issue (optionally with image).
- **View Problems:** Browse community problems, view details, and solutions.
- **Suggest Solution:** Add solutions to problems, upvote others, and comment.
- **My Problems:** View and manage problems you've reported.

---

## Development Notes

- **Proxy:** Frontend uses Vite's proxy to forward `/api` and `/uploads` requests to the backend.
- **Uploads:** Images are stored in `backend/uploads` and served via `/uploads`.
- **Authentication:** JWT tokens are stored in cookies and localStorage for session management.
- **Error Handling:** Errors are displayed in the UI and logged in the backend.

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=your_mongo_uri/crowdsolve
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
NODE_ENV=development
VITE_BACKEND_URL=http://localhost:5000
```

---

## Scripts

### Backend

- `npm run dev` — Start server with nodemon
- `npm start` — Start server

### Frontend

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

---

## License

MIT

---

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.

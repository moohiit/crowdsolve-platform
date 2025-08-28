import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "../backend/config/db.js";
import authRoutes from "../backend/routes/authRoutes.js";
import problemRoutes from "../backend/routes/problemRoutes.js";
import solutionRoutes from "../backend/routes/solutionRoutes.js";
import errorMiddleware from "../backend/middleware/errorMiddleware.js";
import path from 'path';
import http from "http";
import { Server } from "socket.io";
import socketSetup from "../backend/socket/socket.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: [process.env.CLIENT_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// Serve static assets if in production
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend/dist', 'index.html'));
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes); // Pass upload middleware to routes needing it
app.use("/api/solutions", solutionRoutes);

// Error handling
app.use(errorMiddleware);

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// ✅ Export io
socketSetup(io);
const PORT = process.env.PORT || 5000;
// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
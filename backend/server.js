import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes); // Pass upload middleware to routes needing it
app.use("/api/solutions", solutionRoutes);

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
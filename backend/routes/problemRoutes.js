// routes/problemRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProblem,
  getProblems,
  getProblem,
  getUserProblems,
  deleteProblem,
} from "../controllers/problemController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createProblem);
router.get("/", getProblems); // Public
router.get("/:id", getProblem); // Public
router.get("/user/my-problems", protect, getUserProblems);
router.delete("/:id", protect, deleteProblem);

export default router;

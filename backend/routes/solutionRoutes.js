import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSolution,
  upvoteSolution,
  createComment,
  getSolutions,
  getComments,
} from "../controllers/solutionController.js";

const router = express.Router();

router.post("/:problemId", protect, createSolution);
router.put("/:id/upvote", protect, upvoteSolution);
router.post("/:solutionId/comments", protect, createComment);
router.get("/:problemId", getSolutions); // Public
router.get("/:solutionId/comments", getComments); // Public

export default router;

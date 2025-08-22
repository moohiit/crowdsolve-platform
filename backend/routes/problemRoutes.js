import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProblem,
  getProblems,
  getProblem,
} from "../controllers/problemController.js";

const problemRoutes = (upload) => {
  const router = express.Router();

  router.post("/", protect, upload.single("image"), createProblem);
  router.get("/", getProblems); // Public
  router.get("/:id", getProblem); // Public

  return router;
};

export default problemRoutes;

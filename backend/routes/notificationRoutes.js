import express from "express";

import { createNotification, getNotifications, markAllAsRead, markAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNotification);
router.get("/", protect, getNotifications);
router.patch("/mark-as-read/:id", protect, markAsRead);
router.patch("/mark-all-as-read", protect, markAllAsRead);

export default router;

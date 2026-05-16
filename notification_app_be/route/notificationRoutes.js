const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controller/notificationController");

router.post("/notifications", createNotification);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markAsRead);

module.exports = router;
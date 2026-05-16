const Log = require("../utils/logger");

const TOKEN = process.env.TOKEN;

let notifications = [];

const createNotification = async (req, res) => {
  await Log("backend", "info", "controller", "Create notification API hit", TOKEN);

  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      await Log("backend", "error", "handler", "Missing required fields", TOKEN);
      return res.status(400).json({ error: "All fields are required" });
    }

    const notification = {
      id: Date.now().toString(),
      userId,
      type,
      message,
      isRead: false,
      createdAt: new Date(),
    };

    notifications.push(notification);

    await Log("backend", "info", "service", "Notification stored in memory", TOKEN);

    res.status(201).json(notification);

  } catch (err) {
    await Log("backend", "fatal", "controller", err.message, TOKEN);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNotifications = async (req, res) => {
  await Log("backend", "info", "controller", "Get notifications API hit", TOKEN);

  try {
    let { limit = 10, page = 1, type } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    let filtered = notifications;

    if (type) {
      filtered = filtered.filter(n => n.type === type);
      await Log("backend", "debug", "service", "Filtered by type", TOKEN);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    res.json({
      notifications: paginated,
      total: filtered.length,
      page,
      limit,
    });

  } catch (err) {
    await Log("backend", "error", "controller", err.message, TOKEN);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  await Log("backend", "info", "controller", "Mark as read API hit", TOKEN);

  try {
    const { id } = req.params;

    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      await Log("backend", "warn", "handler", "Notification not found", TOKEN);
      return res.status(404).json({ error: "Not found" });
    }

    notification.isRead = true;

    await Log("backend", "info", "service", "Notification marked as read", TOKEN);

    res.json({ id, status: "read" });

  } catch (err) {
    await Log("backend", "fatal", "controller", err.message, TOKEN);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {createNotification, getNotifications, markAsRead,
};
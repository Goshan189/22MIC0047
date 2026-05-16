import React, { useEffect, useState } from "react";
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "./api/notificationApi";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const res = await getNotifications();
    setNotifications(res.data.notifications);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!message.trim()) return;

    await createNotification({
      userId: "123",
      type: "Placement",
      message,
    });

    setMessage("");
    fetchData();
  };

  const handleRead = async (id) => {
    await markAsRead(id);
    fetchData();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Notifications</h2>

      {/* Input + Buttons */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          style={{ padding: 5, marginRight: 10 }}
        />

        <button onClick={handleCreate}>Create</button>

        <button
          onClick={fetchData}
          style={{ marginLeft: 10 }}
        >
          Refresh
        </button>
      </div>

      {/* Notification List */}
      <ul>
        {notifications.map((n) => (
          <li key={n.id} style={{ marginBottom: 10 }}>
            {n.message} - {n.isRead ? "Read" : "Unread"}

            {!n.isRead && (
              <button
                onClick={() => handleRead(n.id)}
                style={{ marginLeft: 10 }}
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
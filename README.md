Overview

This system is designed to handle notifications for students related to placements, events, and results. The goal is to allow users to receive updates in real time and also be able to view past notifications efficiently.

Core Features
Create a notification
Fetch notifications (with pagination and filters)
Mark notifications as read
Real-time notification delivery
API Design
1. Create Notification

POST /notifications

Headers:

Authorization: Bearer <token>
Content-Type: application/json

Request:

{
  "userId": "string",
  "type": "Placement",
  "message": "Amazon is hiring"
}

Response:

{
  "id": "uuid",
  "status": "created",
  "createdAt": "timestamp"
}
2. Get Notifications

GET /notifications

Query params:

limit
page
type (optional filter)

Example:

GET /notifications?limit=10&page=1&type=Placement

Response:

{
  "notifications": [
    {
      "id": "uuid",
      "type": "Placement",
      "message": "Amazon is hiring",
      "isRead": false,
      "createdAt": "timestamp"
    }
  ],
  "total": 100
}
3. Mark as Read

PATCH /notifications/:id/read

Headers:

Authorization: Bearer <token>

Response:

{
  "id": "uuid",
  "status": "read"
}
Data Structure

Each notification will have:

{
  "id": "string",
  "userId": "string",
  "type": "Event | Result | Placement",
  "message": "string",
  "isRead": false,
  "createdAt": "timestamp"
}
Real-time Notifications

For real-time updates, WebSockets can be used so that new notifications are pushed to the client instantly.

If WebSockets are not used, polling can be done at regular intervals, but that is less efficient.

Design Note

Notifications should be saved in the database before being sent to users. This ensures that even if delivery fails, the data is not lost and can be fetched later.

Authentication

All APIs are protected and require a Bearer token:

Authorization: Bearer <access_token>
Summary

This design focuses on keeping APIs simple and predictable while supporting real-time updates and efficient data fetching.

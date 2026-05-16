# Stage 1

## Overview

The system for notifications is designed to help students get updates about placements, events and results. The main goal is to let users get updates in time and also be able to see past notifications easily.

## Core Features

We can create a notification get notifications with pagination and filters mark notifications as read and get real-time notification delivery.

## API Design

### 1. Create Notification

We use the POST method to create a notification at /notifications. We need to include the following in the headers:

Authorization: Bearer token and

Content-Type: application/json.

The request will have the following format:

{

"userId": "string"

"type": "Placement"

"message": "Amazon is hiring"

}

The response will be:

{

"id": "uuid"

"status": "created"

"createdAt": "timestamp"

}

### 2. Get Notifications

We use the GET method to get notifications at /notifications. We can include the query parameters:

limit,

page and

type (optional filter).

For example:

GET /notifications?limit=10&page=1&type=Placement

The response will be:

{

"notifications": [

{

"id": "uuid"

"type": "Placement"

"message": "Amazon is hiring"

"isRead":

"createdAt": "timestamp"

}

]

"total": 100

}

### 3. Mark as Read

We use the PATCH method to mark a notification as read at /notifications/:id/read. We need to include the following in the headers:

Authorization: Bearer token.

The response will be:

{

"id": "uuid"

"status": "read"

}

Data Structure

Each notification will have the following format:

{

"id": "string"

"userId": "string"

"type": "Event | Result | Placement"

"message": "string"

"isRead":

"createdAt": "timestamp"

}

## Real-time Notifications

We can use WebSockets to get real-time updates so that new notifications are pushed to the client instantly. If we do not use WebSockets we can do polling at intervals but that is less efficient.

## Design Note

Notifications should be saved in the database before being sent to users. This ensures that even if delivery fails the data is not lost and can be fetched later.

## Authentication

All APIs are. Require a Bearer token:

Authorization: Bearer access_token

## Summary

This design focuses on keeping APIs simple and predictable while supporting real-time updates and efficient data fetching.

# Stage 2. Database Design

## Database Choice

We use PostgreSQL because the notification data is structured and requires querying based on user read status and time.

## Table Structure

The notifications table has the following columns:

id (UUID / string)

user_id (string)

type (string)

message (text)

is_read (

created_at (timestamp)

## Indexing Strategy

We create an index on the user_id and created_at columns:

CREATE INDEX idx_user_time

ON notifications(user_id created_at DESC);

# Stage 3. Query Optimization

## Given Query

The given query is:

SELECT \* FROM notifications

WHERE studentID = 1042 AND isRead =

ORDER BY createdAt ASC;

## Problem

This query can become slow as the number of notifications grows because it may scan the entire table if no suitable index is present filtering on studentID and isRead is not optimized and sorting using ORDER BY createdAt adds extra overhead.

## Solution

We create an index on the fields used in filtering and sorting:

CREATE INDEX idx_notifications

ON notifications(studentID, isRead, createdAt DESC);

# Stage 4. Handling High Load

## Problem

If notifications are fetched from the database on every page load it can lead to high load as the number of users increases. Frequent queries for recent notifications can cause performance bottlenecks.

## Solutions

1. Caching

We can cache frequently accessed notifications using Redis. This reduces repeated database queries. Improves response time.

2. Pagination

of fetching all notifications we use limit and page parameters. This is already implemented in the API.

3. Lazy Loading

We load initial notifications and fetch more data when needed such as when the user scrolls or takes an action.

4. Real-time Updates

of repeatedly polling the server we use WebSockets or Server-Sent Events to push new notifications to users.

Design Insight

Caching should be used carefully as stale data can lead to inconsistencies. A balance between freshness and performance is required.

# Stage 5. Improving notify_all Function

## Problem

The current implementation processes notifications for each user, which is slow when the number of users is large. If sending email fails it may lead to state and there is no retry mechanism for failed operations.

## Improved Approach

We use a queue-based system.

## High-Level Flow

The system pushes notification jobs to a queue and a worker processes each job independently. Each job stores the notification in the database. Sends an email to the user. Failed jobs can be retried automatically.

## Benefits

This approach provides processing through parallel execution, better scalability and more reliable handling due to retry handling.

## Design Insight

Database. Email sending should be handled separately to ensure that even if email delivery fails the notification is still stored and can be retried later.

# Stage 6. Priority Notifications

## Approach

Notifications are prioritized based on their type and recency to improve user experience.

## Priority Logic

Each notification is assigned a weight based on its type:

Placement → 3

Result → 2

Event → 1

recent notifications are given higher priority.

## Scoring Method

The priority score is calculated as:

priority_score = type_weight + recency_factor

where type_weight is based on importance and recency_factor is derived from the creation time.

## Sorting

Notifications are sorted in descending order of priority score and the top N notifications are returned.

## Example

A recent placement notification will rank higher than an event notification due, to both higher type weight and recency.

## Design Insight

This approach ensures that important and recent notifications are shown first without adding complexity.

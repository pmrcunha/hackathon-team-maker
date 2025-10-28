# Hackathon Team Maker - API Documentation

## Overview

This API provides complete CRUD operations for users and topics in the hackathon team maker application.

## Base URL
```
http://localhost:3000
```

## Users API

### Get All Users
- **GET** `/api/users`
- **Response**: List of all users with their current topic information

### Get User by ID
- **GET** `/api/users/:id`
- **Response**: User details with current topic and created topics

### Create User
- **POST** `/api/users`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe"
  }
  ```

### Update User
- **PUT** `/api/users/:id`
- **Body**:
  ```json
  {
    "email": "newemail@example.com",
    "name": "New Name"
  }
  ```

### Delete User
- **DELETE** `/api/users/:id`

### Leave Topic
- **POST** `/api/users/:id/leave-topic`

## Topics API

### Get All Topics
- **GET** `/api/topics`
- **Response**: List of all topics with member counts

### Get Topic by ID
- **GET** `/api/topics/:id`
- **Response**: Topic details with all members

### Create Topic
- **POST** `/api/topics`
- **Body**:
  ```json
  {
    "title": "AI-powered Chat App",
    "description": "Build a chat application using modern AI",
    "creatorId": "user-uuid"
  }
  ```

### Update Topic
- **PUT** `/api/topics/:id`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description"
  }
  ```

### Delete Topic
- **DELETE** `/api/topics/:id`

### Join Topic
- **POST** `/api/topics/:id/join`
- **Body**:
  ```json
  {
    "userId": "user-uuid"
  }
  ```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Example Usage

### Creating a User and Topic Flow

1. Create a user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "name": "Alice Smith"}'
```

2. Create a topic (user automatically joins):
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{"title": "Web3 DApp", "description": "Build a decentralized app", "creatorId": "user-id-from-step-1"}'
```

3. Have another user join the topic:
```bash
curl -X POST http://localhost:3000/api/topics/topic-id/join \
  -H "Content-Type: application/json" \
  -d '{"userId": "another-user-id"}'
```

## Business Rules

1. **Users can only be in one topic at a time** - Joining a new topic automatically removes them from their current topic
2. **Topic creators automatically join their topics** - When creating a topic, the creator is automatically added as a member
3. **Deleting a topic removes all members** - All users are removed from the topic before deletion
4. **Cascading deletes** - Deleting a user also deletes all topics they created

## Database Schema

### Users Table
- `id` (Primary Key, UUID)
- `email` (Unique)
- `name`
- `currentTopicId` (Foreign Key to topics.id, nullable)
- `createdAt`
- `updatedAt`

### Topics Table
- `id` (Primary Key, UUID)
- `title`
- `description`
- `creatorId` (Foreign Key to users.id)
- `createdAt`
- `updatedAt`
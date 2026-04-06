# Backend API Requirements

This React frontend requires a backend API server with the following endpoints:

## Base URL
Default: `http://localhost:5000/api`

Configure in `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Required API Endpoints

### Bug Endpoints

#### GET `/api/bugs`
Get all bugs
```json
Response: [
  {
    "id": "00102250",
    "title": "Login Page Error",
    "description": "Unable to log in with valid credentials",
    "status": "Open",
    "priority": "High",
    "assignedTo": "john",
    "environment": "Windows / Chrome / v21.0",
    "reproductionSteps": [
      {
        "step": 1,
        "description": "Open login page",
        "screenshot": null,
        "expected": "Page loads",
        "actual": "Page loads"
      }
    ],
    "createdAt": "2026-02-28T00:00:00.000Z",
    "updatedAt": "2026-02-28T00:00:00.000Z"
  }
]
```

#### GET `/api/bugs/stats`
Get bug statistics
```json
Response: {
  "total": 10,
  "open": 5,
  "inProgress": 3,
  "closed": 2
}
```

#### GET `/api/bugs/:id`
Get single bug by ID
```json
Response: {
  "id": "00102250",
  "title": "Login Page Error",
  ...
}
```

#### GET `/api/bugs/assigned/:username`
Get bugs assigned to a specific user
```json
Response: [
  {
    "id": "00102250",
    "assignedTo": "john",
    ...
  }
]
```

#### POST `/api/bugs`
Create new bug
```json
Request Body: {
  "title": "Bug Title",
  "description": "Bug description",
  "priority": "High",
  "assignedTo": "john",
  "environment": "Windows / Chrome / v21.0",
  "reproductionSteps": [
    {
      "step": 1,
      "description": "Step description",
      "screenshot": null,
      "expected": "Expected result",
      "actual": "Actual result"
    }
  ]
}

Response: {
  "id": "00102260",
  "status": "Open",
  "createdAt": "2026-03-02T00:00:00.000Z",
  "updatedAt": "2026-03-02T00:00:00.000Z",
  ...
}
```

#### PUT `/api/bugs/:id`
Update bug (full update)
```json
Request Body: {
  "title": "Updated Title",
  "description": "Updated description",
  ...
}

Response: {
  "id": "00102250",
  "updatedAt": "2026-03-02T00:00:00.000Z",
  ...
}
```

#### PATCH `/api/bugs/:id/status`
Update bug status only
```json
Request Body: {
  "status": "In Progress"
}

Response: {
  "id": "00102250",
  "status": "In Progress",
  "updatedAt": "2026-03-02T00:00:00.000Z",
  ...
}
```

#### PATCH `/api/bugs/:id/assign`
Assign bug to user
```json
Request Body: {
  "assignedTo": "Emily"
}

Response: {
  "id": "00102250",
  "assignedTo": "Emily",
  "updatedAt": "2026-03-02T00:00:00.000Z",
  ...
}
```

#### DELETE `/api/bugs/:id`
Delete bug
```json
Response: {
  "message": "Bug deleted successfully"
}
```

### User Endpoints

#### GET `/api/users`
Get all users
```json
Response: ["john", "Emily", "Mike", "Sarah", "David"]
```

### File Upload Endpoint

#### POST `/api/upload`
Upload screenshot
```
Request: multipart/form-data with file field "screenshot"

Response: {
  "filename": "1234567890.png",
  "path": "/uploads/1234567890.png"
}
```

## CORS Configuration

Your backend must enable CORS for the React frontend:

```javascript
// Example for Express.js
const cors = require('cors');
app.use(cors());
```

## Status Values
- `"Open"` - Newly reported bug
- `"In Progress"` - Bug is being worked on
- `"Closed"` - Bug is resolved

## Priority Values
- `"High"` - Critical issue
- `"Medium"` - Normal issue
- `"Low"` - Minor issue

## Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let bugs = []; // Your bug storage

app.get('/api/bugs', (req, res) => {
  res.json(bugs);
});

app.get('/api/bugs/stats', (req, res) => {
  res.json({
    total: bugs.length,
    open: bugs.filter(b => b.status === 'Open').length,
    inProgress: bugs.filter(b => b.status === 'In Progress').length,
    closed: bugs.filter(b => b.status === 'Closed').length
  });
});

// ... implement other endpoints

app.listen(5000, () => {
  console.log('Backend API running on http://localhost:5000');
});
```

## Database Schema

You can use any database (MongoDB, PostgreSQL, MySQL, etc.). Here's a suggested schema:

### Bug Collection/Table
```
{
  id: String (unique, primary key),
  title: String (required),
  description: String (required),
  status: String (enum: Open, In Progress, Closed),
  priority: String (enum: High, Medium, Low),
  assignedTo: String (nullable),
  environment: String (required),
  reproductionSteps: Array of Objects [{
    step: Number,
    description: String,
    screenshot: String (URL),
    expected: String,
    actual: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection/Table
```
{
  username: String (unique, primary key),
  name: String,
  email: String,
  role: String
}
```

## Testing Your Backend

You can test your backend endpoints using:
- Postman
- curl commands
- Browser DevTools

Example curl command:
```bash
curl http://localhost:5000/api/bugs
```

## Troubleshooting

1. **CORS Error**: Enable CORS in your backend
2. **Connection Refused**: Make sure backend is running on port 5000
3. **404 Not Found**: Check your API endpoint paths match exactly
4. **500 Server Error**: Check backend logs for errors

## Security Notes

For production:
- Add authentication/authorization
- Validate all inputs
- Use environment variables for sensitive data
- Implement rate limiting
- Add proper error handling
- Use HTTPS

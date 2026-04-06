# 🚀 Quick Start Guide - Bug Reproduction Recorder

## ⚠️ IMPORTANT - Backend Required

This is a **frontend-only** React application. You must create and run your own backend API server.

See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for complete API specifications.

## Installation (One-Time Setup)

### Step 1: Configure Backend URL

Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

Or copy from example:
```powershell
Copy-Item .env.example .env
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install all required React packages including axios for API calls.

## Running the Application

### Prerequisites
1. ✅ Your backend API server must be running
2. ✅ Backend should be accessible at `http://localhost:5000`
3. ✅ CORS must be enabled in your backend

### Start the Frontend
```powershell
npm start
```

The application will automatically open in your default browser at:
**http://localhost:3000**

## 🔌 Connecting to Your Backend

The frontend will make API calls to your backend server for:
- **Fetching all bugs** (`GET /api/bugs`)
- **Creating new bugs** (`POST /api/bugs`)
- **Updating bug details** (`PUT /api/bugs/:id`)
- **Changing bug status** (`PATCH /api/bugs/:id/status`)
- **Assigning bugs** (`PATCH /api/bugs/:id/assign`)
- **Deleting bugs** (`DELETE /api/bugs/:id`)
- **Fetching users** (`GET /api/users`)
- **Upload screenshots** (`POST /api/bugs/:id/screenshot`)

See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for detailed specifications.

## ✨ Try These Features

### 1. View Dashboard
- Statistics cards showing bug counts
- Browse all bugs
- Click "View Details" on any bug

### 2. Report a New Bug
- Click "Report Bug" in navigation
- Fill in the form:
  - Title: "Test Bug"
  - Description: "This is a test"
  - Priority: Select from dropdown
  - Assign To: Select a user
  - Environment: (Auto-detected!)

### 3. Use the Step Recorder
- Click "🎬 Start Recording Steps"
- Enter step description: "Step 1 description"
- Optionally add Expected/Actual results
- Click "➕ Add Step"
- Add more steps as needed
- Click "Submit Bug Report"

### 4. Replay Bug Steps
- Open any bug with steps
- Scroll to "Reproduction Steps"
- Click "▶️ Replay Steps"
- Watch the animated playback!

### 5. Manage Your Bugs
- Click "My Bugs" in navigation
- See bugs assigned to "john"
- Change status using dropdown
- Download bug reports using ⬇️ button

## 💾 Data Persistence

All data is stored in your backend database/storage.
The frontend fetches fresh data from your API on each page load.

## 🐛 Troubleshooting

### "Failed to fetch bugs" Error
**Problem**: Cannot connect to backend API

**Solutions**:
1. Make sure your backend server is running on port 5000
2. Check backend URL in `.env` file
3. Verify CORS is enabled in your backend
4. Check browser console for detailed error messages

### Port 3000 Already in Use
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### CORS Error
**Problem**: "Cross-Origin Request Blocked"

**Solution**: Add CORS middleware to your backend:
```javascript
// Express.js example
const cors = require('cors');
app.use(cors());
```

### API Endpoint 404 Errors
**Problem**: Backend endpoints not found

**Solution**: 
1. Check [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md)
2. Verify your backend implements all required endpoints
3. Ensure API paths match exactly (e.g., `/api/bugs`, not `/bugs`)

### Application Not Loading
1. Check terminal for errors
2. Make sure you ran `npm install`
3. Try clearing browser cache (Ctrl + Shift + Delete)
4. Check if backend is accessible: `curl http://localhost:5000/api/bugs`

## 📡 Testing Backend Connection

Test if your backend is responding:

```powershell
# Using curl (if installed)
curl http://localhost:5000/api/bugs

# Or using PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/bugs
```

Expected response: JSON array of bugs

## 🔧 Development Mode

The React app runs in development mode with:
- Hot reload - Changes reflect immediately
- Detailed error messages  
- Source maps for debugging

## 📦 Build for Production

When ready to deploy:

```powershell
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🌐 Environment Variables

Create `.env` file with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update to your production backend URL:
localStorage.removeItem('bugs');
location.reload();
```

## 🎨 Application Structure

```
📱 Navigation Bar (Top)
  ├── Dashboard - View all bugs & stats
  ├── Report Bug - Create new bug with recorder
  └── My Bugs - View assigned bugs

📊 Dashboard Page
  ├── 4 Statistics Cards
  └── Recent Bugs Table

📝 Report Bug Page
  ├── Bug Information Form
  └── Interactive Step Recorder

🔍 Bug Details Page
  ├── Bug Header with Status
  ├── Environment & Description
  ├── Reproduction Steps
  ├── Replay Button
  └── Status Update Buttons

📋 My Bugs Page
  ├── Assigned Bugs Table
  └── Quick Status Update
```

## ⌨️ Keyboard Shortcuts

- `Ctrl + Click` on links - Open in new tab
- `F5` - Refresh page (refetches data from backend)
- `F12` - Open developer tools

## 💡 Tips for Testing

### Sample Test Scenarios

**Test 1: Create a Bug**
- Navigate to Report Bug
- Fill all fields
- Record 3 steps with recorder
- Submit and verify on Dashboard (requires backend to be running)

**Test 2: Replay Feature**
- Open any bug with recorded steps
- Click "Replay Steps"
- Watch the animated playback
- Verify all steps highlight in sequence

**Test 3: Status Workflow**
- Go to "My Bugs"
- Change a bug from "Open" to "In Progress"
- Open bug details to verify status change
- Mark as "Closed"

**Test 4: Assignment**
- Open any bug
- Change assigned user from dropdown
- Click ✓ to save
- Verify in "My Bugs" for that user

**Test 5: Download Report**
- Go to "My Bugs"
- Click ⬇️ button on any bug
- Check downloaded .txt file with bug details

## 🎯 Quick Reference

### Bug Status Options
- **Open** (Red) - Newly reported
- **In Progress** (Purple) - Currently being fixed
- **Closed** (Green) - Resolved

### Priority Levels
- **High** (Red) - Critical issues
- **Medium** (Yellow) - Normal issues  
- **Low** (Gray) - Minor issues

### Default Users
The users list comes from your backend API (`GET /api/users`)

## 📞 Need Help?

Check the detailed documentation:
- [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) - Complete API specification
- [README.md](README.md) - Full project documentation

---

**Ready to start? Make sure your backend is running, then:**
```powershell
npm start
```

- Check README.md for detailed documentation
- Look at console for error messages (F12)
- Verify all dependencies are installed
- Make sure Node.js version is 14+

---

**Enjoy using Bug Reproduction Recorder! 🎉**


# Bug Reproduction Recorder for QA Teams

> **React Frontend Application** - Enterprise-level bug tracking and reproduction system with step recorder, environment tagging, bug replay functionality, and dev assignment workflow.

**⚠️ IMPORTANT**: This is a frontend-only application. You need to create and run your own backend API server.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## 🔧 Prerequisites

### Required
1. **Backend API Server** - You must create your own backend server
   - See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for complete API specification
   - Default expected URL: `http://localhost:5000/api`
2. **Node.js** (v14 or higher)
3. **npm** (v6 or higher)

## ⚙️ Configuration

### Step 1: Set Backend API URL

Create a `.env` file in the project root:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

Or copy from example:
```bash
cp .env.example .env
```

Update the URL to match your backend server.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start the React frontend
npm start
```

The application will open at **http://localhost:3000**

### ⚠️ Backend Server Must Be Running

Before using the application:
1. Start your backend API server on `http://localhost:5000`
2. Ensure all required endpoints are implemented (see BACKEND_API_REQUIREMENTS.md)
3. Enable CORS in your backend

## ✨ Features

- 🎬 **Step Recorder** - Record reproduction steps in real-time with expected vs actual results
- 🏷️ **Environment Auto-Detection** - Automatically detect OS, browser, and version
- ▶️ **Replay Bug Steps** - Animated step-by-step bug reproduction with visual highlighting
- 👥 **Dev Assignment Flow** - Assign bugs to developers with complete status tracking
- 📊 **Dashboard Analytics** - Visual statistics of bug status (Total/Open/In Progress/Closed)
- 🎯 **Priority Management** - Categorize bugs by priority (High/Medium/Low)
- ⬇️ **Export Bug Reports** - Download bug reports in text format for documentation
- 💾 **Backend Integration** - RESTful API integration with complete CRUD operations
- 🔄 **Real-time Data** - Fresh data fetched from backend on each page load
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
npm install

# Start the application
npm start
```

The application will open automatically at **http://localhost:3000**

## 📁 Project Structure

```
bug-reproduction-recorder/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # Dashboard with statistics
│   │   ├── Dashboard.css
│   │   ├── ReportBug.jsx        # Bug report form with step recorder
│   │   ├── ReportBug.css
│   │   ├── BugDetails.jsx       # Bug details with replay feature
│   │   ├── BugDetails.css
│   │   ├── MyBugs.jsx          # Personal assigned bugs view
│   │   └── MyBugs.css
│   ├── context/
│   │   └── BugContext.jsx       # Global state management & API calls
│   ├── services/
│   │   └── api.js              # Axios API service layer
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                 # Global styles
│   ├── index.js                # React entry point
│   └── index.css               # Base styles
├── .env                        # Backend API URL configuration
├── .env.example                # Example environment variables
├── package.json
├── README.md
└── .gitignore
```

## 🎯 Application Pages

### 1. **Dashboard** (`/`)
- View bug statistics in colorful cards
- Browse all recent bugs in a table
- Quick access to bug details
- Real-time stats: Total, Open, In Progress, Closed bugs

### 2. **Report Bug** (`/report`)
- Fill in bug title and description
- Select priority level (Low/Medium/High)
- Assign to a developer (optional)
- **Environment auto-detected** (OS, browser, version)
- **Interactive Step Recorder:**
  - Click "Start Recording Steps"
  - Add reproduction steps one by one
  - Include Expected vs Actual results
  - Click "Add Step" for each step
  - Remove steps if needed
  - Submit complete bug report

### 3. **Bug Details** (`/bug/:id`)
- View complete bug information
- See all reproduction steps with checkboxes
- **Replay Steps Feature:**
  - Click "Replay Steps" button
  - Watch animated step-by-step reproduction
  - Visual highlighting of current step
  - Automatic checkbox marking
- Change bug status (Open/In Progress/Closed)
- Reassign to different developer
- View expected vs actual results for each step

### 4. **My Assigned Bugs** (`/my-bugs`)
- View all bugs assigned to current user
- Update bug status directly from table
- Download bug reports for documentation
- Quick access to bug details
- Color-coded status badges
- Priority indicators

## 🎨 User Interface

### Color Scheme
- **Primary Blue**: `#2c5aa0` - Navigation, headers, primary actions
- **Success Green**: `#28a745` - Closed status, success actions
- **Danger Red**: `#dc3545` - Open status, high priority
- **Warning Orange**: `#ffc107` - Medium priority
- **Purple**: `#6f42c1` - In Progress status
- **Gray**: `#6c757d` - Low priority, secondary elements

### Status Colors
- 🔴 **Open** - Red background
- 🔵 **In Progress** - Purple background
- ✅ **Closed** - Green background

### Priority Colors
- 🔴 **High** - Red badge
- 🟡 **Medium** - Yellow badge
- ⚪ **Low** - Gray badge

## 💾 Data Management

### Backend API Integration
All bug data is managed through your backend API server:
- **Data Source**: RESTful API endpoints
- **Format**: JSON request/response
- **Persistence**: Backend database/storage
- **Real-time**: Fresh data fetched on each page load

### Required Backend Endpoints
See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for complete specifications:
- `GET /api/bugs` - Fetch all bugs
- `POST /api/bugs` - Create new bug
- `GET /api/bugs/:id` - Get bug details
- `PUT /api/bugs/:id` - Update bug
- `PATCH /api/bugs/:id/status` - Update status
- `PATCH /api/bugs/:id/assign` - Assign bug
- `DELETE /api/bugs/:id` - Delete bug
- `GET /api/users` - Fetch users
- `POST /api/bugs/:id/screenshot` - Upload screenshot

### Users Management
Users are fetched from your backend API (`GET /api/users`).

## 🔧 Key Features Explained

### 1. Step Recorder
The step recorder allows QA engineers to capture exact reproduction steps:
- **Real-time Capture**: Add steps as you perform actions
- **Expected vs Actual**: Track what should happen vs what actually happens
- **Step Numbering**: Automatic sequential numbering
- **Edit Capability**: Remove any step if needed
- **Screenshot Support**: Ready for future screenshot attachments

### 2. Environment Auto-Detection
Automatically captures environment details:
```javascript
// Example output
"Windows / Chrome / v120"
"macOS / Safari / v15"
"Linux / Firefox / v102"
```

### 3. Replay Functionality
Visual step-by-step replay with animations:
- **2-second intervals** between steps
- **Visual highlighting** of current step
- **Checkbox marking** for completed steps
- **Color transitions** for better UX
- **Expected/Actual display** during replay

### 4. Dev Assignment Workflow
Complete bug lifecycle management:
```
1. Create Bug (Status: Open)
2. Assign to Developer
3. Developer marks "In Progress"
4. Testing & Verification
5. Mark as "Closed"
```

## 📋 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from create-react-app (one-way operation)
npm run eject
```

## 🔌 Technology Stack

- **React 18.2.0** - UI framework with JSX syntax
- **React Router DOM 6.16.0** - Client-side routing
- **Context API** - Global state management
- **Axios 1.5.0** - HTTP client for API requests
- **CSS3** - Styling with flexbox, grid, animations
- **Create React App** - Project scaffolding

### Backend Requirements
- RESTful API server with JSON responses
- CORS enabled for frontend communication
- See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md)

## 📱 Responsive Design

The application is fully responsive:
- **Desktop** (1200px+): Full layout with sidebar navigation
- **Tablet** (768px - 1199px): Adjusted grid layouts
- **Mobile** (< 768px): Stacked layouts, hamburger menu

## 🎮 Usage Examples

### Creating a Bug Report
```javascript
1. Navigate to "Report Bug"
2. Enter Title: "Login button not responding"
3. Enter Description: "When clicking login, nothing happens"
4. Select Priority: "High"
5. Assign To: "john"
6. Environment: Auto-detected
7. Click "Start Recording Steps"
8. Add Step 1: "Navigate to login page"
9. Add Step 2: "Enter valid credentials"
10. Add Step 3: "Click login button"
   - Expected: "User should be redirected to dashboard"
   - Actual: "Nothing happens, button doesn't respond"
11. Click "Submit Bug Report"
```

### Replaying Bug Steps
```javascript
1. Open any bug from Dashboard
2. Scroll to "Reproduction Steps"
3. Click "Replay Steps" button
4. Watch automated step-by-step playback
5. Steps highlight in sequence with 2-second intervals
6. Checkboxes automatically mark as steps complete
```

### Downloading Bug Report
```javascript
1. Navigate to "My Bugs"
2. Find bug in table
3. Click download button (⬇️) in Actions column
4. Text file downloads with complete bug information
```

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] Real-time collaboration with WebSockets
- [ ] Screenshot capture and attachment
- [ ] Screen recording integration
- [ ] Email notifications for assignments
- [ ] Advanced filtering and search
- [ ] Bug comments and discussions
- [ ] File attachments beyond screenshots
- [ ] Integration with JIRA/GitHub Issues
- [ ] Custom fields and workflows
- [ ] Advanced reporting and analytics
- [ ] Export to PDF/Excel
- [ ] Dark mode theme
- [ ] Multi-language support

## 🐛 Troubleshooting

### Backend Connection Failed
**Problem**: "Failed to fetch bugs" or network errors

**Solutions**:
1. Verify backend server is running on `http://localhost:5000`
2. Check `.env` file has correct `REACT_APP_API_URL`
3. Ensure CORS is enabled in backend
4. Test backend directly: `curl http://localhost:5000/api/bugs`

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### API Endpoint 404 Errors
**Problem**: Specific endpoints not found

**Solution**: Verify your backend implements all required endpoints in [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md)

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Open an issue in the repository
- Check existing documentation
- Review console for error messages

## 🙏 Acknowledgments

- Built with Create React App
- Inspired by modern bug tracking systems
- Designed for QA teams and developers

---

**Built with ❤️ for QA Teams**

**Current Version**: 1.0.0 | **Last Updated**: March 2026

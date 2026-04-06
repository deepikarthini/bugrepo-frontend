import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard.jsx';
import ReportBug from './components/ReportBug.jsx';
import BugDetails from './components/BugDetails.jsx';
import MyBugs from './components/MyBugs.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { BugProvider } from './context/BugContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <BugProvider>
      <div className="App">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="nav-container">
              <h1 className="nav-title">BugRepo for QA Teams</h1>
              <div className="nav-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/report" className="nav-link">Report Bug</Link>
                <Link to="/my-bugs" className="nav-link">My Bugs</Link>
                <span className="user-info">👤 {user?.fullName || user?.email}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </div>
            </div>
          </nav>
        )}

        <div className="content">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
            
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <ReportBug currentUser={user?.email} />
              </ProtectedRoute>
            } />
            <Route path="/bug/:id" element={
              <ProtectedRoute>
                <BugDetails currentUser={user?.email} />
              </ProtectedRoute>
            } />
            <Route path="/my-bugs" element={
              <ProtectedRoute>
                <MyBugs currentUser={user?.fullName} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </BugProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

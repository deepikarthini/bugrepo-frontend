import React, { createContext, useState, useContext, useEffect } from 'react';
import { bugAPI, userAPI } from '../services/api';
import { mapBugToFrontend, STATUS_TO_BACKEND } from '../utils/mappings';

const BugContext = createContext();

export const useBugs = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};

export const BugProvider = ({ children }) => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // Fetch initial data when token is available
  useEffect(() => {
    if (authToken) {
      fetchBugs();
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  // Listen for token changes (when user logs in)
  useEffect(() => {
    const checkTokenChange = () => {
      const token = localStorage.getItem('token');
      if (token !== authToken) {
        setAuthToken(token);
      }
    };
    
    // Check every 500ms for token changes
    const interval = setInterval(checkTokenChange, 500);
    
    return () => clearInterval(interval);
  }, [authToken]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bugAPI.getAllBugs();
      // Map backend data to frontend format
      const mappedBugs = response.data.map(bug => mapBugToFrontend(bug));
      setBugs(mappedBugs);
      setError(null);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError('Session expired. Please login again.');
        // Clear invalid tokens
        localStorage.clear();
        window.location.href = '/login';
      } else {
        setError('Failed to fetch bugs. Make sure your backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      // Remove duplicates: keep only unique names, prioritizing specific emails
      const uniqueUsers = response.data.reduce((acc, user) => {
        // Filter out Rishi user
        if (user.fullName === 'Rishi' || user.email === 'rishi@example.com') {
          return acc;
        }
        
        // Check if we already have a user with this name
        const existingIndex = acc.findIndex(u => u.fullName === user.fullName);
        
        if (existingIndex === -1) {
          // New name, add it
          acc.push(user);
        } else {
          // Duplicate name found - keep the one with specific preferred email
          // For "Deepu K", prefer deepu@example.com
          if (user.fullName === 'Deepu K' && user.email === 'deepu@example.com') {
            acc[existingIndex] = user;
          }
          // Otherwise keep the first one (do nothing)
        }
        return acc;
      }, []);
      
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Fallback users if backend not available - use objects with name and email
      setUsers([
        { fullName: 'Deepu K', email: 'deepu@example.com' },
        { fullName: 'Tom', email: 'tom@example.com' },
        { fullName: 'Kavya', email: 'kavya@example.com' },
        { fullName: 'Nithin', email: 'nithin@example.com' },
        { fullName: 'Diva', email: 'diva@example.com' }
      ]);
    }
  };

  const getStats = () => {
    return {
      total: bugs.length,
      open: bugs.filter(b => b.status === 'Open' || b.status === 'Assigned').length,
      inProgress: bugs.filter(b => b.status === 'In Progress').length,
      closed: bugs.filter(b => b.status === 'Closed' || b.status === 'Resolved').length
    };
  };

  const getBugById = (id) => {
    // Convert id to number for comparison (URL params are strings)
    return bugs.find(b => b.id === Number(id) || b.id === id);
  };

  const getBugsByUser = (username) => {
    return bugs.filter(b => b.assignedTo === username);
  };

  const getMyAssignedBugs = async () => {
    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserEmail = currentUser.email;
    const currentUserFullName = currentUser.fullName;
    
    try {
      // Try to get from backend first
      const response = await bugAPI.getMyAssignedBugs();
      const mappedBugs = response.data.map(bug => mapBugToFrontend(bug));
      return mappedBugs;
    } catch (err) {
      console.error('Error fetching my assigned bugs from backend, using local filter:', err);
    }
    
    // Always use local filtering as fallback or if backend returns nothing
    if (currentUserEmail) {
      // Get all bugs and filter locally where assignedTo matches email OR fullName
      const myBugs = bugs.filter(b => 
        b.assignedTo === currentUserEmail || 
        b.assignedTo === currentUserFullName
      );
      console.log('Filtered my bugs locally:', myBugs.length, 'bugs found');
      return myBugs;
    }
    
    return [];
  };

  const createBug = async (bugData) => {
    try {
      const response = await bugAPI.createBug(bugData);
      setBugs([response.data, ...bugs]);
      return response.data;
    } catch (err) {
      console.error('Error creating bug:', err);
      throw err;
    }
  };

  const updateBug = async (id, updates) => {
    try {
      const response = await bugAPI.updateBug(id, updates);
      setBugs(bugs.map(bug => bug.id === id ? response.data : bug));
    } catch (err) {
      console.error('Error updating bug:', err);
      throw err;
    }
  };

  const updateBugStatus = async (id, status) => {
    try {
      // Convert frontend status to backend enum
      const backendStatus = STATUS_TO_BACKEND[status] || status;
      const response = await bugAPI.updateBugStatus(id, backendStatus);
      // Map the response back to frontend format
      const mappedBug = mapBugToFrontend(response.data);
      setBugs(bugs.map(b => b.id === id ? mappedBug : b));
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const assignBug = async (id, assignedTo) => {
    try {
      const bug = getBugById(id);
      const updates = { ...bug, assignedTo };
      const response = await bugAPI.updateBug(id, updates);
      setBugs(bugs.map(b => b.id === id ? response.data : b));
    } catch (err) {
      console.error('Error assigning bug:', err);
      throw err;
    }
  };

  const deleteBug = async (id) => {
    try {
      await bugAPI.deleteBug(id);
      setBugs(bugs.filter(bug => bug.id !== id));
    } catch (err) {
      console.error('Error deleting bug:', err);
      throw err;
    }
  };

  const value = {
    bugs,
    users,
    loading,
    error,
    getStats,
    getBugById,
    getBugsByUser,
    getMyAssignedBugs,
    createBug,
    updateBug,
    updateBugStatus,
    assignBug,
    deleteBug,
    refreshBugs: fetchBugs,
  };

  return <BugContext.Provider value={value}>{children}</BugContext.Provider>;
};

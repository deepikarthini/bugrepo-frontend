import axios from 'axios';

// API Base URL - update this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized and 403 Forbidden responses (invalid/expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;
    
    // Handle authentication errors
    if ((status === 401 || status === 403) && 
        currentPath !== '/login' && 
        currentPath !== '/register') {
      console.error('Authentication failed. Clearing session and redirecting to login.');
      // Clear all localStorage
      localStorage.clear();
      // Redirect to login
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

// Bug API endpoints
export const bugAPI = {
  // Get all bugs
  getAllBugs: () => api.get('/bugs'),
  
  // Get bug statistics
  getStats: () => api.get('/bugs/stats'),
  
  // Get single bug by ID
  getBugById: (id) => api.get(`/bugs/${id}`),
  
  // Get bugs assigned to user
  getBugsByUser: (username) => api.get(`/bugs/assigned/${username}`),
  
  // Get bugs assigned to current logged-in user
  getMyAssignedBugs: () => api.get('/bugs/my-assigned'),
  
  // Create new bug
  createBug: (bugData) => api.post('/bugs', bugData),
  
  // Update bug
  updateBug: (id, updates) => api.put(`/bugs/${id}`, updates),
  
  // Update bug status
  updateBugStatus: (id, status) => api.patch(`/bugs/${id}/status?status=${status}`),
  
  // Assign bug to user
  assignBug: (id, assignedTo) => api.patch(`/bugs/${id}/assign`, { assignedTo }),
  
  // Delete bug
  deleteBug: (id) => api.delete(`/bugs/${id}`),
  
  // Upload screenshot
  uploadScreenshot: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// User API endpoints
export const userAPI = {
  // Get all users
  getAllUsers: () => api.get('/users'),
};

export default api;

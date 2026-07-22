import axios from 'axios';

// API Base URL - update this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

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

// A 401 means the token is missing, invalid, or expired. A 403 means the
// authenticated user lacks permission and must not destroy their session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;
    
    // Handle authentication errors
    if (status === 401 &&
        currentPath !== '/login' && 
        currentPath !== '/register') {
      console.error('Authentication failed. Clearing session and redirecting to login.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('sessionActive');
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

  // Get AI insights for a bug
  getAiInsights: (id) => api.get(`/bugs/${id}/ai-insights`),

  // Regenerate AI insights for a bug
  regenerateAiInsights: (id) => api.post(`/bugs/${id}/ai-insights/regenerate`),

  // Export AI bug report
  exportAiReport: (id) => api.get(`/bugs/${id}/ai-report`, { responseType: 'blob' }),
  
  // Get bugs assigned to user
  getBugsByUser: (username) => api.get(`/bugs/assigned/${username}`),
  
  // Get bugs assigned to current logged-in user
  getMyAssignedBugs: () => api.get('/bugs/my-assigned'),

  // Get bugs reported by current logged-in user
  getMyReportedBugs: () => api.get('/bugs/my-reports'),
  
  // Create new bug
  createBug: (bugData) => api.post('/bugs', bugData),
  
  // Update bug
  updateBug: (id, updates) => api.put(`/bugs/${id}`, updates),
  
  // Update bug status
  updateBugStatus: (id, status) => api.patch(`/bugs/${id}/status?status=${status}`),
  
  // Assign bug to user
  assignBug: (id, developerId) => api.patch(`/bugs/${id}/assign/${developerId}`),
  
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

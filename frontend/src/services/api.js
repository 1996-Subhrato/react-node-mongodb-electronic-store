import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // You can add logic here to handle tokens if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const status = error.response?.status;
    const url = error.config?.url;

    // Suppress console errors for expected 401 checks on initial load
    if (status === 401 && (url?.includes('/auth/profile') || url?.includes('/admin/dashboard'))) {
       // do nothing, let the caller handle the rejection
    } else {
        console.error('API Error:', message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

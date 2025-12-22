import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's an auth token issue, not API key issues
    if (error.response?.status === 401 && error.response?.data?.message?.toLowerCase().includes('token')) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

// Crop API
export const cropAPI = {
  addCrop: (cropData) => api.post('/crop/add', cropData),
  getMyCrops: () => api.get('/crop/my-crops'),
  getAllCrops: () => api.get('/crop/all'),
  deleteCrop: (id) => api.delete(`/crop/${id}`)
};

// Analytics API
// Analytics API
export const analyticsAPI = {
  getIncome: (period) => api.get(`/analytics/income?period=${period}`),
  getPriceTrends: () => api.get('/analytics/price-trends'),
  getCropSummary: () => api.get('/analytics/crop-summary')
};

// Dealer API
export const dealerAPI = {
  addDealer: (dealerData) => api.post('/dealer/add', dealerData),
  getDealers: (cropType) => api.get(`/dealer/list${cropType ? `?cropType=${cropType}` : ''}`),
  updateDealer: (id, dealerData) => api.put(`/dealer/${id}`, dealerData),
  deleteDealer: (id) => api.delete(`/dealer/${id}`)
};

// Tips API
export const tipsAPI = {
  addTip: (tipData) => api.post('/tips/add', tipData),
  getTips: (category) => api.get(`/tips/list${category ? `?category=${category}` : ''}`),
  deleteTip: (id) => api.delete(`/tips/${id}`)
};

// Weather API
export const weatherAPI = {
  getWeather: (city) => api.get(`/weather/${city}`)
};

// Chat API
export const chatAPI = {
  getMessages: () => api.get('/chat/messages'),
  sendMessage: (messageData) => api.post('/chat/message', messageData)
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getAdminOrders: () => api.get('/orders/admin'),
  getFarmerOrders: () => api.get('/orders/farmer'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status })
};

export default api;


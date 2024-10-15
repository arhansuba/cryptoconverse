import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  // User related API calls
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getUserProfile: () => api.get('/users/profile'),

  // Education related API calls
  getLessons: () => api.get('/education/lessons'),
  getLesson: (id) => api.get(`/education/lessons/${id}`),
  submitQuiz: (quizId, answers) => api.post(`/education/quizzes/${quizId}`, { answers }),

  // Market analysis related API calls
  getMarketData: (symbol) => api.get(`/market/data/${symbol}`),
  getTrendAnalysis: (symbol) => api.get(`/market/trends/${symbol}`),

  // Trading related API calls
  placeOrder: (orderData) => api.post('/trading/orders', orderData),
  getOrderHistory: () => api.get('/trading/orders'),

  // AI related API calls
  getChatbotResponse: (message) => api.post('/ai/chat', { message }),
  getSentimentAnalysis: (text) => api.post('/ai/sentiment', { text }),

  // Add more API calls as needed
};
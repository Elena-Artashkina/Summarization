// frontend/src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
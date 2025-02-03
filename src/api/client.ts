import axios from 'axios';

const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
baseURL: 'http://localhost:3000/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
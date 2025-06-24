import axios from 'axios';

const api = axios.create({
  baseURL: '/', // The proxy in vite.config.js will handle the full URL
  withCredentials: true, // This is crucial for sending cookies with requests
});

export default api;
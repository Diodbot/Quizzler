import axios from 'axios';

const api = axios.create({
  baseURL: 'https://quizzler-f2k8.onrender.com',
  withCredentials: true,  // always send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

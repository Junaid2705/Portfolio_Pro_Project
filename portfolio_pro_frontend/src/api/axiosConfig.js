// src/api/axiosConfig.js
// NOTE: baseURL is '/' not 'http://localhost:8080'
// because vite.config.js proxy forwards /api → http://localhost:8080
// This also means ZERO CORS errors

import axios from 'axios'

const API = axios.create({
  baseURL: '/',   // Vite proxy takes care of routing to Spring Boot
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle expired token globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API

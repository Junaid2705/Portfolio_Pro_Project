// src/api/axiosConfig.js
// FIX 4: Removed auto-logout on 401 so admin stays logged in
// FIX 5: Public portfolio route does not need auth

import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// Auto attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// FIX: Only logout on 401 if it's NOT a public route
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isPublicRoute =
      url.includes('/api/portfolio/public/') ||
      url.includes('/api/contact/') ||
      url.includes('/api/auth/')

    // Only redirect to login if token is expired AND it's a protected route
    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API

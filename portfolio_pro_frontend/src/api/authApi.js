// src/api/authApi.js
import API from './axiosConfig'

// Calls POST /api/auth/login on Spring Boot
export const loginUser = async (email, password) => {
  const response = await API.post('/api/auth/login', { email, password })
  return response.data  // { token, role, name, email, userId }
}

// Calls POST /api/auth/register on Spring Boot
export const registerUser = async (name, email, password) => {
  const response = await API.post('/api/auth/register', { name, email, password })
  return response.data  // { token, role, name, email, userId }
}

// Save login data to browser localStorage
export const saveAuthData = (data) => {
  localStorage.setItem('token',  data.token)
  localStorage.setItem('role',   data.role)
  localStorage.setItem('name',   data.name)
  localStorage.setItem('email',  data.email)
  localStorage.setItem('userId', String(data.userId))
}

export const logout = () => {
  localStorage.clear()
  window.location.href = '/login'
}

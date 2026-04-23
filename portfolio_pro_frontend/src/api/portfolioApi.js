// src/api/portfolioApi.js

import API from './axiosConfig'

// GET  — fetch current user's portfolio
export const getMyPortfolio = async () => {
  const res = await API.get('/api/portfolio/my')
  return res.data
}

// POST — create portfolio (first time)
export const createPortfolio = async (data) => {
  const res = await API.post('/api/portfolio/create', data)
  return res.data
}

// PUT  — update existing portfolio
export const updatePortfolio = async (data) => {
  const res = await API.put('/api/portfolio/update', data)
  return res.data
}

// PUT  — toggle publish/draft
export const publishPortfolio = async () => {
  const res = await API.put('/api/portfolio/publish')
  return res.data
}

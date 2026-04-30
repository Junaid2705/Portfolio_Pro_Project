// src/api/adminApi.js

import API from './axiosConfig'

export const getAdminStats     = async ()     => (await API.get('/api/admin/stats')).data
export const getAllUsers        = async ()     => (await API.get('/api/admin/users')).data
export const toggleUser        = async (id)   => (await API.put(`/api/admin/users/${id}/toggle`)).data
export const deleteUser        = async (id)   => await API.delete(`/api/admin/users/${id}`)
export const getAllPortfolios   = async ()     => (await API.get('/api/admin/portfolios')).data
export const approvePortfolio  = async (id)   => (await API.put(`/api/admin/portfolios/${id}/approve`)).data
export const rejectPortfolio   = async (id)   => (await API.put(`/api/admin/portfolios/${id}/reject`)).data

// src/api/projectApi.js

import API from './axiosConfig'

export const getMyProjects = async () => {
  const res = await API.get('/api/projects')
  return res.data
}

export const createProject = async (data) => {
  const res = await API.post('/api/projects', data)
  return res.data
}

export const updateProject = async (id, data) => {
  const res = await API.put(`/api/projects/${id}`, data)
  return res.data
}

export const deleteProject = async (id) => {
  await API.delete(`/api/projects/${id}`)
}

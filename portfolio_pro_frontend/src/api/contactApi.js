// src/api/contactApi.js
// FIX 2: Uses correct endpoint matching ContactController

import axios from 'axios'

export const sendContactMessage = async (slug, data) => {
  const res = await axios.post(
    `http://localhost:8080/api/contact/${slug}`,
    data,
    { headers: { 'Content-Type': 'application/json' } }
  )
  return res.data
}

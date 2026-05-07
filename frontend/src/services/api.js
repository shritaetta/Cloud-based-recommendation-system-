import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => api.post('/api/users/register', data)
export const login = (data) => api.post('/api/users/login', data)

// Health checks
export const getGatewayHealth = () => api.get('/health')

// Resume
export const uploadResume = (formData) => api.post('/api/resume/upload-resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getResume = (userId) => api.get(`/api/resume/${userId}`)
export const analyzeResume = (data) => api.post('/api/resume/analyze-resume', data)

// Internships
export const getInternships = (params) => api.get('/api/internships/', { params })
export const getInternshipById = (id) => api.get(`/api/internships/${id}`)
export const getRecommendations = (data) => api.post('/api/internships/recommendations', data)

export default api

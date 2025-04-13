import axios from 'axios'

const API_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (userData) => api.post('/register', userData)
export const login = (credentials) => api.post('/login', credentials)
export const getTasks = () => api.get('/tasks')
export const addTask = (task) => api.post('/tasks', task)
export const updateTask = (id, updates) => api.put(`/tasks/${id}`, updates)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)

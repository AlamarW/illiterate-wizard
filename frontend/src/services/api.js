import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const api = {
  // Language specifications
  saveLanguage: (spec) => apiClient.post('/api/languages', spec),

  getLanguages: () => apiClient.get('/api/languages'),

  getLanguage: (id) => apiClient.get(`/api/languages/${id}`),

  updateLanguage: (id, spec) => apiClient.put(`/api/languages/${id}`, spec),

  deleteLanguage: (id) => apiClient.delete(`/api/languages/${id}`),

  // Generation
  generateLanguage: (request) => apiClient.post('/api/generate', request),

  downloadLanguage: (languageName) =>
    apiClient.get(`/api/download/${languageName}`, {
      responseType: 'blob'
    })
}

export default api

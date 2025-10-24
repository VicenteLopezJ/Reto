import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const applicantService = {
  // Obtener todos los applicants activos
  getAll: () => api.get('/applicant'),
  
  // Obtener applicant por ID
  getById: (id) => api.get(`/applicant/${id}`),
  
  // Obtener applicants por estado
  getByStatus: (status) => api.get(`/applicant/status/${status}`),
  
  // Crear nuevo applicant
  create: (data) => api.post('/applicant/save', data),
  
  // Actualizar applicant
  update: (data) => api.put('/applicant/update', data),
  
  // Eliminar (lógico)
  delete: (id) => api.patch(`/applicant/delete/${id}`),
  
  // Restaurar
  restore: (id) => api.patch(`/applicant/restore/${id}`),
};

export const areaService = {
  getAll: () => api.get('/area'),
  getById: (id) => api.get(`/area/${id}`),
  create: (data) => api.post('/area/save', data),
  update: (data) => api.put('/area/update', data),
  delete: (id) => api.patch(`/area/delete/${id}`),
  restore: (id) => api.patch(`/area/restore/${id}`),
};

export default api;
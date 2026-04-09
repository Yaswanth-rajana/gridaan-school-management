import api from './api';

export const getTasks = async (page = 1, limit = 10, status = '') => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const completeTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/complete`);
  return response.data;
};

export const getTasksByStudent = async (studentId) => {
  const response = await api.get(`/tasks/student/${studentId}`);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
};
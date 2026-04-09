import api from './api';

export const getStudents = async (page = 1, limit = 10, search = '') => {
  const response = await api.get('/students', {
    params: { page, limit, search }
  });
  return response.data;
};

export const addStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
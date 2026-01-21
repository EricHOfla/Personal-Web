import { apiCall } from './api';

export const getExperiences = () => apiCall('/api/experiences/');
export const createExperience = (data) =>
  apiCall('/api/experiences/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateExperience = (id, data) =>
  apiCall(`/api/experiences/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteExperience = (id) =>
  apiCall(`/api/experiences/${id}/`, {
    method: 'DELETE',
  });
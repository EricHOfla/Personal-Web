import { apiCall } from './api';

export const getEducation = () => apiCall('/api/education/');
export const createEducation = (data) =>
  apiCall('/api/education/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateEducation = (id, data) =>
  apiCall(`/api/education/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteEducation = (id) =>
  apiCall(`/api/education/${id}/`, {
    method: 'DELETE',
  });
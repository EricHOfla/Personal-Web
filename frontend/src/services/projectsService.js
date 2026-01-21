import { apiCall } from './api';

export const getProjects = () => apiCall('/api/projects/');
export const createProject = (data) =>
  apiCall('/api/projects/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateProject = (id, data) =>
  apiCall(`/api/projects/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteProject = (id) =>
  apiCall(`/api/projects/${id}/`, {
    method: 'DELETE',
  });
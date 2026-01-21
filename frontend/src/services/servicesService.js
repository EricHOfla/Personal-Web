import { apiCall } from './api';

export const getServices = () => apiCall('/api/services/');
export const createService = (data) =>
  apiCall('/api/services/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateService = (id, data) =>
  apiCall(`/api/services/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteService = (id) =>
  apiCall(`/api/services/${id}/`, {
    method: 'DELETE',
  });
import { apiCall } from './api';

export const getSidenavItems = () => apiCall('/api/sidenav-items/');
export const createSidenavItem = (data) =>
  apiCall('/api/sidenav-items/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateSidenavItem = (id, data) =>
  apiCall(`/api/sidenav-items/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSidenavItem = (id) =>
  apiCall(`/api/sidenav-items/${id}/`, {
    method: 'DELETE',
  });
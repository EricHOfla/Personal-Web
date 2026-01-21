import { apiCall } from './api';

export const getSocialLinks = () => apiCall('/api/social-links/');
export const createSocialLink = (data) =>
  apiCall('/api/social-links/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateSocialLink = (id, data) =>
  apiCall(`/api/social-links/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSocialLink = (id) =>
  apiCall(`/api/social-links/${id}/`, {
    method: 'DELETE',
  });
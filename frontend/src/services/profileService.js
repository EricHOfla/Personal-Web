import { apiCall } from './api';


export const getProfile = () => apiCall('/api/profile/');
export const updateProfile = (data) =>
  apiCall('/api/profile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
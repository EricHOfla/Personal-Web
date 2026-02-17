import { apiCall } from './api';


export const getProfile = () => apiCall('/api/profile/', { cache: false });
export const updateProfile = (data) =>
  apiCall('/api/profile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
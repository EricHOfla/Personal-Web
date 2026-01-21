import { apiCall } from './api';

export const getFunFacts = () => apiCall('/api/fun-facts/');
export const createFunFact = (data) =>
  apiCall('/api/fun-facts/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateFunFact = (id, data) =>
  apiCall(`/api/fun-facts/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteFunFact = (id) =>
  apiCall(`/api/fun-facts/${id}/`, {
    method: 'DELETE',
  });
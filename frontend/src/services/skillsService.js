import { apiCall } from './api';

export const getSkills = (search = '') => {
  const endpoint = search ? `/api/skills/?search=${encodeURIComponent(search)}` : '/api/skills/';
  return apiCall(endpoint);
};
export const createSkill = (data) =>
  apiCall('/api/skills/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateSkill = (id, data) =>
  apiCall(`/api/skills/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSkill = (id) =>
  apiCall(`/api/skills/${id}/`, {
    method: 'DELETE',
  });
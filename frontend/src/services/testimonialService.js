import { apiCall } from './api';

export const getAllTestimonials = () => apiCall('/api/testimonials/');
export const createTestimonial = (data) => apiCall('/api/testimonials/', {
    method: 'POST',
    body: data, // Note: For file uploads, we pass the FormData directly without JSON.stringify
    headers: {} // apiCall in api.js adds Content-Type: application/json by default, 
    // but fetch handles FormData automatically if we don't set Content-Type.
});

import { apiCall } from './api';

export const getAllTestimonials = () => apiCall('/api/testimonials/');

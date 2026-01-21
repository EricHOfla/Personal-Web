import { apiCall } from './api';

export const getBlogPost = (slug) => apiCall(`/api/blog-posts/${slug}/`);
export const getAllBlogPosts = () => apiCall('/api/blog-posts/');
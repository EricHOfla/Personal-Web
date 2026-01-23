import { apiCall } from './api';

// Fetch post (no longer increments view count)
export const getBlogPost = (slug) => apiCall(`/api/blog-posts/${slug}/`);

// Fetch all posts
export const getAllBlogPosts = () => apiCall('/api/blog-posts/');

// Track a view (POST request to dedicated endpoint)
export const trackBlogView = (slug) => apiCall(`/api/blog-posts/${slug}/view/`, { method: 'POST' });

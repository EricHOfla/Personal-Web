import { apiCall } from './api';

// Fetch post
export const getBlogPost = (slug) => apiCall(`/api/blog-posts/${slug}/`);

// Fetch all posts
export const getAllBlogPosts = () => apiCall('/api/blog-posts/');

// Track view count
export const trackBlogPostView = (slug) => apiCall(`/api/blog-posts/${slug}/view/`, { method: 'POST' });


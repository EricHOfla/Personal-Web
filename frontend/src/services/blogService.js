import { apiCall } from './api';

// Fetch post
export const getBlogPost = (slug) => apiCall(`/api/blog-posts/${slug}/`, { cache: true });

// Fetch all posts
export const getAllBlogPosts = () => apiCall('/api/blog-posts/', { cache: true });

// Track view count
export const trackBlogPostView = (slug) => apiCall(`/api/blog-posts/${slug}/view/`, { method: 'POST' });


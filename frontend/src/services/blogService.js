import { apiCall } from './api';

// Fetch post
export const getBlogPost = (slug) => apiCall(`/api/blog-posts/${slug}/`, { cache: false });

// Fetch all posts
export const getAllBlogPosts = () => apiCall('/api/blog-posts/', { cache: false });

// Track view count
export const trackBlogPostView = (slug) => apiCall(`/api/blog-posts/${slug}/view/`, { method: 'POST' });


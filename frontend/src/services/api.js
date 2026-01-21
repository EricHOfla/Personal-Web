// api.js

// Base API host
const API_HOST = process.env.REACT_APP_API_URL || 'https://personal-web-srv9.onrender.com/api/';

// Build full endpoint URL
const buildUrl = (endpoint) => {
  if (!endpoint) return API_HOST;
  return `${API_HOST}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

// API call function (for GET, POST, PUT, DELETE, etc.)
export const apiCall = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const { headers, ...rest } = options;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // Try to parse JSON; return raw response if not JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return response;
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Build absolute URL for media files served by Django
export const buildMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Remove leading slash if present for consistent handling
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove 'media/' prefix if already present to avoid duplication
  if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.slice(6);
  }
  
  return `${API_HOST}/media/${cleanPath}`;
};

// Example helper for GET requests
export const apiGet = (endpoint, headers = {}) => {
  return apiCall(endpoint, { method: 'GET', headers });
};

// Example helper for POST requests
export const apiPost = (endpoint, data, headers = {}) => {
  return apiCall(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

// Example helper for PUT requests
export const apiPut = (endpoint, data, headers = {}) => {
  return apiCall(endpoint, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
};

// Example helper for DELETE requests
export const apiDelete = (endpoint, headers = {}) => {
  return apiCall(endpoint, {
    method: 'DELETE',
    headers,
  });
};

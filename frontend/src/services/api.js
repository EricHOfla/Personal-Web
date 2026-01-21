// api.js

// Base API host
const API_HOST = process.env.REACT_APP_API_URL || 'https://personal-web-srv9.onrender.com/api/';

// Build full endpoint URL with trailing slash
const buildUrl = (endpoint) => {
  if (!endpoint) return API_HOST;
  
  // Ensure no double slashes
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Ensure trailing slash
  if (!cleanEndpoint.endsWith('/')) cleanEndpoint += '/';

  return `${API_HOST}${cleanEndpoint}`;
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

  let cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Remove 'media/' prefix if already present
  if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.slice(6);
  }

  // Ensure trailing slash is **not added here**, only in API endpoints
  return `${API_HOST}media/${cleanPath}`;
};

// Helpers for each HTTP method
export const apiGet = (endpoint, headers = {}) => apiCall(endpoint, { method: 'GET', headers });
export const apiPost = (endpoint, data, headers = {}) => apiCall(endpoint, { method: 'POST', headers, body: JSON.stringify(data) });
export const apiPut = (endpoint, data, headers = {}) => apiCall(endpoint, { method: 'PUT', headers, body: JSON.stringify(data) });
export const apiDelete = (endpoint, headers = {}) => apiCall(endpoint, { method: 'DELETE', headers });

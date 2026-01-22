// api.js

// Base API host
const API_HOST = process.env.REACT_APP_API_URL || 'https://personal-web-srv9.onrender.com';

// Build full endpoint URL with trailing slash
const buildUrl = (endpoint) => {
  if (!endpoint) return API_HOST;

  // Remove leading slash to avoid double slashes
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Ensure trailing slash for API endpoints
  if (!cleanEndpoint.endsWith('/')) cleanEndpoint += '/';

  const fullUrl = `${API_HOST}/${cleanEndpoint}`;
  return fullUrl;
};

// API call function
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
      throw new Error(`API Error: ${response.status} at ${url}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return response;
    }
  } catch (error) {
    console.error('[API] Call failed:', error);
    console.error('[API] Endpoint tried:', url);
    throw error;
  }
};

// Build media URL
export const buildMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const mediaUrl = `${API_HOST}${path}`;
  return mediaUrl;
};

// Helpers for HTTP methods
export const apiGet = (endpoint, headers = {}) => apiCall(endpoint, { method: 'GET', headers });
export const apiPost = (endpoint, data, headers = {}) => apiCall(endpoint, { method: 'POST', headers, body: JSON.stringify(data) });
export const apiPut = (endpoint, data, headers = {}) => apiCall(endpoint, { method: 'PUT', headers, body: JSON.stringify(data) });
export const apiDelete = (endpoint, headers = {}) => apiCall(endpoint, { method: 'DELETE', headers });

// api.js
import cacheService from './cacheService';

// Base API host
const API_HOST = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'https://personal-web-srv9.onrender.com';

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

// API call function with caching support
export const apiCall = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const { headers, body, cache = true, cacheTTL, ...rest } = options;
  
  // Only cache GET requests
  const method = options.method || 'GET';
  const shouldCache = cache && method === 'GET';
  
  // Check cache for GET requests
  if (shouldCache) {
    const cacheKey = `api:${url}`;
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      console.log('[API Cache] Hit:', url);
      return cachedData;
    }
  }

  const finalHeaders = { ...headers };
  // If body is not FormData, default to application/json
  if (!(body instanceof FormData)) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
  }

  try {
    // Add timeout to prevent hanging forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      headers: finalHeaders,
      body,
      method,
      signal: controller.signal,
      ...rest,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} at ${url}`);
    }

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = response;
    }
    
    // Cache successful GET responses
    if (shouldCache && data) {
      const cacheKey = `api:${url}`;
      cacheService.set(cacheKey, data, cacheTTL);
      console.log('[API Cache] Set:', url);
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[API] Request timeout:', url);
      throw new Error(`Request timeout: ${url}`);
    }
    console.error('[API] Call failed:', error);
    console.error('[API] Endpoint tried:', url);
    throw error;
  }
};

// Build media URL
export const buildMediaUrl = (path) => {
  if (!path) return '';
  
  // If already a full URL (Cloudinary or external), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // For relative paths, prepend /media/
  const host = API_HOST.endsWith('/') ? API_HOST.slice(0, -1) : API_HOST;
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If path doesn't already start with /media/, add it
  if (!cleanPath.startsWith('/media/')) {
    cleanPath = `/media${cleanPath}`;
  }

  const mediaUrl = `${host}${cleanPath}`;
  return mediaUrl;
};

// URL for dynamic resume PDF
export const getResumePdfUrl = () => {
  return `${API_HOST}/api/generate-resume/`;
};

// Helpers for HTTP methods
export const apiGet = (endpoint, headers = {}, cache = true, cacheTTL) => 
  apiCall(endpoint, { method: 'GET', headers, cache, cacheTTL });
export const apiPost = (endpoint, data, headers = {}) => 
  apiCall(endpoint, { method: 'POST', headers, body: JSON.stringify(data), cache: false });
export const apiPut = (endpoint, data, headers = {}) => 
  apiCall(endpoint, { method: 'PUT', headers, body: JSON.stringify(data), cache: false });
export const apiDelete = (endpoint, headers = {}) => 
  apiCall(endpoint, { method: 'DELETE', headers, cache: false });

// Clear cache helper
export const clearApiCache = () => {
  cacheService.clearAll();
  console.log('[API Cache] Cleared all cache');
};

/**
 * Admin API Service Client
 */
const ADMIN_API_BASE = window.API_BASE_URL || 'http://localhost:8080/api';

class AdminApiService {
  constructor() {
    this.baseUrl = ADMIN_API_BASE;
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = localStorage.getItem('ks_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401 || response.status === 403) {
        // Redirect to admin login if unauthorized
        if (!window.location.pathname.includes('/login/')) {
          localStorage.removeItem('ks_admin_token');
          localStorage.removeItem('ks_admin_user');
          const isSubpage = window.location.pathname.includes('/pages/');
          const root = isSubpage ? '../../' : './';
          window.location.href = `${root}pages/login/index.html`;
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with code ${response.status}`);
      }

      return data;
    } catch (err) {
      console.warn(`[Admin API] ${options.method || 'GET'} ${endpoint} error:`, err.message);
      throw err;
    }
  }

  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  patch(endpoint, body) { return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

const adminApiService = new AdminApiService();
if (typeof window !== 'undefined') {
  window.adminApiService = adminApiService;
}

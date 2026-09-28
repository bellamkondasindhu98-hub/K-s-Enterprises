/**
 * Admin Authentication & Session Guard Service
 */
class AdminAuthService {
  constructor() {
    this.tokenKey = 'ks_admin_token';
    this.userKey = 'ks_admin_user';
  }

  async login(email, password) {
    const res = await adminApiService.post('/auth/login', { email, password });
    if (res.success && res.data) {
      if (res.data.role !== 'ADMIN') {
        throw new Error('Access denied: You must be an administrator to log into this dashboard.');
      }
      localStorage.setItem(this.tokenKey, res.data.token);
      localStorage.setItem(this.userKey, JSON.stringify(res.data));
    }
    return res;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    const isSubpage = window.location.pathname.includes('/pages/');
    const root = isSubpage ? '../../' : './';
    window.location.href = `${root}pages/login/index.html`;
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser() {
    const json = localStorage.getItem(this.userKey);
    return json ? JSON.parse(json) : null;
  }

  guard() {
    if (!this.isAuthenticated() && !window.location.pathname.includes('/login/')) {
      const isSubpage = window.location.pathname.includes('/pages/');
      const root = isSubpage ? '../../' : './';
      window.location.href = `${root}pages/login/index.html`;
    }
  }
}

const adminAuthService = new AdminAuthService();
if (typeof window !== 'undefined') {
  window.adminAuthService = adminAuthService;
}

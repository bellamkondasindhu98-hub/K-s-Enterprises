/**
 * K's Enterprises - Authentication Service
 */
class AuthService {
  constructor() {
    this.tokenKey = 'ks_auth_token';
    this.userKey = 'ks_user_data';
  }

  async login(email, password) {
    const res = await apiService.post('/auth/login', { email, password });
    if (res.success && res.data) {
      this.setSession(res.data);
    }
    return res;
  }

  async register(name, email, phone, password, confirmPassword) {
    const res = await apiService.post('/auth/register', {
      name,
      email,
      phone,
      password,
      confirmPassword
    });
    if (res.success && res.data) {
      this.setSession(res.data);
    }
    return res;
  }

  async googleAuth(googleId, email, name, avatarUrl) {
    const res = await apiService.post('/auth/google', {
      googleId,
      email,
      name,
      avatarUrl
    });
    if (res.success && res.data) {
      this.setSession(res.data);
    }
    return res;
  }

  async forgotPassword(email) {
    return await apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, newPassword, confirmPassword) {
    return await apiService.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
  }

  setSession(authData) {
    localStorage.setItem(this.tokenKey, authData.token);
    localStorage.setItem(this.userKey, JSON.stringify({
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role
    }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.reload();
  }

  getUser() {
    const userJson = localStorage.getItem(this.userKey);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'ADMIN';
  }
}

const authService = new AuthService();
if (typeof window !== 'undefined') {
  window.authService = authService;
}

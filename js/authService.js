/**
 * K's ENTERPRISES - Fish Feed Company
 * Modular Authentication Service
 * 
 * Supports prototype mock authentication (with local persistence for registered users)
 * and direct connection to backend REST APIs (POST /api/auth/login and POST /api/auth/register).
 */

import { CONFIG } from './config.js';

// Simulated cryptographic hash representation for demo credentials
// In production, hashing is securely performed on the backend using bcrypt/argon2
const MOCK_HASHED_PASSWORD_SALT = "ks_aqua_salt_2026";
function mockHash(str) {
  let hash = 0;
  const salted = str + MOCK_HASHED_PASSWORD_SALT;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

const DEMO_PASSWORD_HASH = mockHash(CONFIG.DEMO_CREDENTIALS.password);

class AuthService {
  constructor() {
    this.sessionKey = CONFIG.SESSION_STORAGE_KEY;
    this.rememberKey = CONFIG.REMEMBER_STORAGE_KEY;
    this.registeredUsersKey = CONFIG.REGISTERED_USERS_STORAGE_KEY;
  }

  /**
   * Retrieves all mock-registered users from storage
   * @returns {Array<object>}
   */
  _getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(this.registeredUsersKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Saves a new registered user to mock storage
   */
  _saveRegisteredUser(user) {
    const users = this._getRegisteredUsers();
    users.push(user);
    try {
      localStorage.setItem(this.registeredUsersKey, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist registered user:', e);
    }
  }

  /**
   * Check if an email is already registered
   * @param {string} email 
   * @returns {boolean}
   */
  isEmailRegistered(email) {
    const normalized = (email || '').trim().toLowerCase();
    if (normalized === CONFIG.DEMO_CREDENTIALS.email.toLowerCase()) {
      return true;
    }
    const users = this._getRegisteredUsers();
    return users.some(u => u.email.toLowerCase() === normalized);
  }

  /**
   * Main login method. Handles both Mock Auth and Real Backend Auth based on config.
   * @param {string} email 
   * @param {string} password 
   * @param {boolean} rememberMe 
   * @returns {Promise<{ success: boolean, user?: object, token?: string, message?: string }>}
   */
  async login(email, password, rememberMe = false) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    
    if (CONFIG.USE_MOCK_AUTH) {
      return this._mockLogin(normalizedEmail, password, rememberMe);
    } else {
      return this._apiLogin(normalizedEmail, password, rememberMe);
    }
  }

  /**
   * Main register method.
   * @param {{ name: string, email: string, phone: string, password: string }} data 
   * @returns {Promise<{ success: boolean, duplicateEmail?: boolean, message: string }>}
   */
  async register({ name, email, phone, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (CONFIG.USE_MOCK_AUTH) {
      return this._mockRegister({ name: name.trim(), email: normalizedEmail, phone: phone.trim(), password });
    } else {
      return this._apiRegister({ name: name.trim(), email: normalizedEmail, phone: phone.trim(), password });
    }
  }

  /**
   * Prototype Mock Authentication
   */
  async _mockLogin(email, password, rememberMe) {
    // Simulate network latency (600ms) to display realistic loading UI
    await new Promise((resolve) => setTimeout(resolve, 600));

    const demoEmail = CONFIG.DEMO_CREDENTIALS.email.toLowerCase();
    const demoPasswordHash = localStorage.getItem('ks_fishfeed_demo_password_hash') || DEMO_PASSWORD_HASH;
    const providedHash = mockHash(password);

    // 1. Check Demo Account
    if (email === demoEmail && providedHash === demoPasswordHash) {
      const mockToken = "ks_jwt_" + btoa(JSON.stringify({
        sub: email,
        iat: Date.now(),
        exp: Date.now() + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000)
      })).replace(/=/g, '');

      const user = {
        email: CONFIG.DEMO_CREDENTIALS.email,
        name: CONFIG.DEMO_CREDENTIALS.name,
        role: CONFIG.DEMO_CREDENTIALS.role,
        farmName: CONFIG.DEMO_CREDENTIALS.farmName,
        phone: CONFIG.DEMO_CREDENTIALS.phone,
        avatar: "ceo.jpg"
      };

      const sessionData = {
        token: mockToken,
        user,
        expiresAt: Date.now() + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000),
        rememberMe
      };

      this._saveSession(sessionData, rememberMe);

      return {
        success: true,
        user,
        token: mockToken
      };
    }

    // 2. Check Registered Mock Accounts
    const registeredUsers = this._getRegisteredUsers();
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email);

    if (foundUser && foundUser.passwordHash === providedHash) {
      const mockToken = "ks_jwt_" + btoa(JSON.stringify({
        sub: foundUser.email,
        iat: Date.now(),
        exp: Date.now() + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000)
      })).replace(/=/g, '');

      const user = {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role, // Automatically "CUSTOMER"
        farmName: foundUser.farmName || "Aquaculture Partner Farm",
        phone: foundUser.phone,
        avatar: "ceo.jpg"
      };

      const sessionData = {
        token: mockToken,
        user,
        expiresAt: Date.now() + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000),
        rememberMe
      };

      this._saveSession(sessionData, rememberMe);

      return {
        success: true,
        user,
        token: mockToken
      };
    }

    return {
      success: false,
      message: 'Invalid login credentials'
    };
  }

  /**
   * Prototype Mock Registration
   */
  async _mockRegister({ name, email, phone, password }) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Duplicate email check
    if (this.isEmailRegistered(email)) {
      return {
        success: false,
        duplicateEmail: true,
        message: 'An account with this email already exists. Please login.'
      };
    }

    const newUser = {
      id: "usr_reg_" + Date.now(),
      name,
      email,
      phone,
      passwordHash: mockHash(password),
      role: "CUSTOMER", // New registrations strictly receive CUSTOMER role
      farmName: "Aquaculture Commercial Farm",
      createdAt: new Date().toISOString()
    };

    this._saveRegisteredUser(newUser);

    return {
      success: true,
      message: 'Account created successfully!'
    };
  }

  /**
   * Real Backend API Authentication
   */
  async _apiLogin(email, password, rememberMe) {
    try {
      const response = await fetch(CONFIG.AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Invalid login credentials'
        };
      }

      const sessionData = {
        token: data.token,
        user: data.user,
        expiresAt: data.expiresAt || (Date.now() + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000)),
        rememberMe
      };

      this._saveSession(sessionData, rememberMe);

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('API Authentication Error:', error);
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please verify backend is running.'
      };
    }
  }

  /**
   * Real Backend API Registration
   */
  async _apiRegister({ name, email, phone, password }) {
    try {
      const response = await fetch(CONFIG.REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password, role: 'CUSTOMER' })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          duplicateEmail: data.duplicateEmail || response.status === 409,
          message: data.message || 'Registration failed. Please try again.'
        };
      }

      return {
        success: true,
        message: data.message || 'Account created successfully!'
      };
    } catch (error) {
      console.error('API Registration Error:', error);
      return {
        success: false,
        message: 'Unable to connect to registration server. Please verify backend is running.'
      };
    }
  }

  /**
   * Save session to storage based on Remember Me preference
   */
  _saveSession(sessionData, rememberMe) {
    const serialized = JSON.stringify(sessionData);
    if (rememberMe) {
      localStorage.setItem(this.sessionKey, serialized);
      localStorage.setItem(this.rememberKey, sessionData.user.email);
      sessionStorage.removeItem(this.sessionKey);
    } else {
      sessionStorage.setItem(this.sessionKey, serialized);
      localStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.rememberKey);
    }
  }

  /**
   * Retrieves active session if present and not expired
   * @returns {object|null}
   */
  getSession() {
    try {
      const rawLocal = localStorage.getItem(this.sessionKey);
      const rawSession = sessionStorage.getItem(this.sessionKey);
      const raw = rawLocal || rawSession;

      if (!raw) return null;

      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch (e) {
      console.error('Failed to parse session:', e);
      return null;
    }
  }

  /**
   * Returns whether a valid authenticated session is active
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getSession() !== null;
  }

  /**
   * Returns current user information
   * @returns {object|null}
   */
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  /**
   * Returns current authentication token
   * @returns {string|null}
   */
  getAuthToken() {
    const session = this.getSession();
    return session ? session.token : null;
  }

  /**
   * Returns remembered email if saved
   * @returns {string|null}
   */
  getRememberedEmail() {
    return localStorage.getItem(this.rememberKey);
  }

  /**
   * Request password reset link for an email
   * @param {string} email 
   * @returns {Promise<{ success: boolean, message: string, token?: string }>}
   */
  async requestPasswordReset(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    
    if (CONFIG.USE_MOCK_AUTH) {
      return this._mockRequestPasswordReset(normalizedEmail);
    } else {
      return this._apiRequestPasswordReset(normalizedEmail);
    }
  }

  /**
   * Reset password with reset token
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async resetPassword(token, newPassword) {
    if (CONFIG.USE_MOCK_AUTH) {
      return this._mockResetPassword(token, newPassword);
    } else {
      return this._apiResetPassword(token, newPassword);
    }
  }

  /**
   * Prototype Mock Password Reset Request
   */
  async _mockRequestPasswordReset(email) {
    // Simulate network latency (600ms) for realistic loading feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockResetToken = "ks_rst_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    // Store simulated pending reset session for prototype continuation to /reset-password
    try {
      sessionStorage.setItem('ks_fishfeed_reset_email', email);
      sessionStorage.setItem('ks_fishfeed_reset_token', mockResetToken);
    } catch (e) {
      // Ignore storage error in non-browser env
    }

    // Security best practice: Never reveal if an email exists in the database
    return {
      success: true,
      message: '✓ If an account exists for this email, a password reset link has been sent.',
      token: mockResetToken
    };
  }

  /**
   * Prototype Mock Password Reset Execution
   */
  async _mockResetPassword(token, newPassword) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const email = sessionStorage.getItem('ks_fishfeed_reset_email') || '';
    const storedToken = sessionStorage.getItem('ks_fishfeed_reset_token') || '';

    if (token && storedToken && token !== 'simulated_token' && token !== storedToken) {
      return {
        success: false,
        message: 'Invalid or expired password reset token.'
      };
    }

    // Update in mock registered users or demo account if matching
    if (email) {
      if (email.toLowerCase() === CONFIG.DEMO_CREDENTIALS.email.toLowerCase()) {
        try {
          localStorage.setItem('ks_fishfeed_demo_password_hash', mockHash(newPassword));
        } catch (e) {}
      }
      const users = this._getRegisteredUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex !== -1) {
        users[userIndex].passwordHash = mockHash(newPassword);
        try {
          localStorage.setItem(this.registeredUsersKey, JSON.stringify(users));
        } catch (e) {}
      }
    }

    // Clear reset token
    sessionStorage.removeItem('ks_fishfeed_reset_email');
    sessionStorage.removeItem('ks_fishfeed_reset_token');

    return {
      success: true,
      message: 'Password has been successfully reset! Please sign in with your new password.'
    };
  }

  /**
   * Real Backend API Password Reset Request
   */
  async _apiRequestPasswordReset(email) {
    try {
      const response = await fetch(CONFIG.FORGOT_PASSWORD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Unable to process password reset request.'
        };
      }

      return {
        success: true,
        message: data.message || 'If an account exists for this email, a password reset link has been sent.',
        token: data.token
      };
    } catch (error) {
      console.error('API Forgot Password Error:', error);
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please verify backend is running.'
      };
    }
  }

  /**
   * Real Backend API Password Reset Execution
   */
  async _apiResetPassword(token, newPassword) {
    try {
      const response = await fetch(CONFIG.RESET_PASSWORD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token, password: newPassword })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Unable to reset password.'
        };
      }

      return {
        success: true,
        message: data.message || 'Password has been reset successfully.'
      };
    } catch (error) {
      console.error('API Reset Password Error:', error);
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please verify backend is running.'
      };
    }
  }

  /**
   * Retrieves pending password reset email for prototype flow
   */
  getPendingResetEmail() {
    try {
      return sessionStorage.getItem('ks_fishfeed_reset_email') || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Logs out the user and clears all session storage
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
  }
}

export const authService = new AuthService();


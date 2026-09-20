/**
 * K's ENTERPRISES - Fish Feed Company
 * Modular Authentication Service
 * 
 * Supports both prototype mock authentication and direct connection
 * to a backend REST API (e.g., POST /api/auth/login on Node.js / Express).
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
   * Prototype Mock Authentication
   * Simulates network delay, token generation, and secure session creation.
   */
  async _mockLogin(email, password, rememberMe) {
    // Simulate network latency (600ms) to display realistic loading UI
    await new Promise((resolve) => setTimeout(resolve, 600));

    const demoEmail = CONFIG.DEMO_CREDENTIALS.email.toLowerCase();
    const providedHash = mockHash(password);

    // Verify credentials against demo account
    if (email === demoEmail && providedHash === DEMO_PASSWORD_HASH) {
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
    } else {
      return {
        success: false,
        message: 'Invalid login credentials'
      };
    }
  }

  /**
   * Real Backend API Authentication
   * Connects to POST /api/auth/login on Node.js / Express
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
      // Check localStorage first, then sessionStorage
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
   * Logs out the user and clears all session storage
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
  }
}

export const authService = new AuthService();

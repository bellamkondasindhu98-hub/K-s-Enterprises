/**
 * K's ENTERPRISES - Fish Feed Company
 * Application Configuration
 */

export const CONFIG = {
  // Application Details
  APP_NAME: "K's ENTERPRISES",
  TAGLINE: "Premium Aquaculture & Fish Feed Solutions",
  
  // Authentication Configuration
  // Toggle USE_MOCK_AUTH to false when ready to connect to Node.js / Express backend
  USE_MOCK_AUTH: true,
  API_BASE_URL: "/api",
  AUTH_ENDPOINT: "/api/auth/login",
  
  // Demo Account for Prototype Testing
  DEMO_CREDENTIALS: {
    email: "demo@gmail.com",
    password: "Demo@123",
    name: "Alex Morgan",
    role: "Aquaculture Farm Manager",
    farmName: "Blue Ocean Aqua Farms"
  },
  
  // Password Complexity Requirements: 8+ chars, 1 uppercase, 1 special char
  PASSWORD_RULES: {
    minLength: 8,
    requireUppercase: true,
    requireSpecialChar: true,
    specialCharRegex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    uppercaseRegex: /[A-Z]/
  },
  
  // Session Configuration
  SESSION_STORAGE_KEY: "ks_fishfeed_auth_session",
  REMEMBER_STORAGE_KEY: "ks_fishfeed_remember_user",
  TOKEN_EXPIRY_HOURS: 24
};

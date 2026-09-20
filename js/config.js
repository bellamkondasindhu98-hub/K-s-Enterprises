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
  REGISTER_ENDPOINT: "/api/auth/register",
  
  // Demo Account for Prototype Testing
  DEMO_CREDENTIALS: {
    email: "demo@gmail.com",
    password: "Demo@123",
    name: "Alex Morgan",
    phone: "+91 9876543210",
    role: "Aquaculture Farm Manager",
    farmName: "Blue Ocean Aqua Farms"
  },
  
  // Password Complexity Requirements:
  // - Minimum 8 characters
  // - At least 1 uppercase letter
  // - At least 1 lowercase letter
  // - At least 1 number
  // - At least 1 special character
  PASSWORD_RULES: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    uppercaseRegex: /[A-Z]/,
    lowercaseRegex: /[a-z]/,
    numberRegex: /[0-9]/,
    specialCharRegex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
  },
  
  // Indian Mobile Number Regex (10 digits, optional +91 or 0 prefix, valid starting digits 6-9)
  INDIAN_PHONE_REGEX: /^(?:(?:\+|0{0,2})91(\s*[-]\s*|[.\s])?|[0]?)?[6789]\d{9}$/,

  // Session Configuration
  SESSION_STORAGE_KEY: "ks_fishfeed_auth_session",
  REMEMBER_STORAGE_KEY: "ks_fishfeed_remember_user",
  REGISTERED_USERS_STORAGE_KEY: "ks_fishfeed_registered_users",
  TOKEN_EXPIRY_HOURS: 24
};

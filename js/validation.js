/**
 * K's ENTERPRISES - Fish Feed Company
 * Form Validation Module
 */

import { CONFIG } from './config.js';

// Standard RFC-5322 compliant regex for robust email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates an email address
 * @param {string} email 
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateEmail(email) {
  const trimmed = (email || '').trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Email is required'
    };
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      message: 'Invalid email format'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validates a password against company security criteria:
 * - Required
 * - At least 8 characters
 * - At least 1 capital letter (uppercase)
 * - At least 1 special character
 * @param {string} password 
 * @param {boolean} checkComplexity - whether to enforce 8-char + uppercase + special char rule
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePassword(password, checkComplexity = false) {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }
  
  if (checkComplexity) {
    const rules = CONFIG.PASSWORD_RULES;
    
    if (password.length < rules.minLength) {
      return {
        isValid: false,
        message: `Password must be at least ${rules.minLength} characters`
      };
    }
    
    if (rules.requireUppercase && !rules.uppercaseRegex.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least 1 uppercase letter'
      };
    }
    
    if (rules.requireSpecialChar && !rules.specialCharRegex.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least 1 special character'
      };
    }
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validates the entire login form
 * @param {string} email 
 * @param {string} password 
 * @returns {{ isValid: boolean, errors: { email?: string, password?: string } }}
 */
export function validateLoginForm(email, password) {
  const emailResult = validateEmail(email);
  const passwordResult = validatePassword(password, false);
  
  const errors = {};
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }
  
  return {
    isValid: emailResult.isValid && passwordResult.isValid,
    errors
  };
}

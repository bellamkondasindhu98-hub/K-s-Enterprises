/**
 * K's ENTERPRISES - Fish Feed Company
 * Form Validation Module
 */

import { CONFIG } from './config.js';

// Standard RFC-5322 compliant regex for robust email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates full name
 * @param {string} name 
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateFullName(name) {
  const trimmed = (name || '').trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Full name is required'
    };
  }
  
  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: 'Full name must be at least 2 characters'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

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
 * Validates Indian Mobile Number
 * Accepts: +91 9876543210, +919876543210, 9876543210, 09876543210, +91-98765-43210
 * @param {string} phone 
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePhoneNumber(phone) {
  const trimmed = (phone || '').trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      message: 'Phone number is required'
    };
  }
  
  // Strip hyphens and spaces for clean evaluation
  const cleaned = trimmed.replace(/[\s-]/g, '');
  
  if (!CONFIG.INDIAN_PHONE_REGEX.test(cleaned)) {
    return {
      isValid: false,
      message: 'Enter a valid Indian mobile number (e.g. +91 9876543210)'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Detailed password evaluation checking all 5 criteria
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * @param {string} password 
 * @returns {{ isValid: boolean, message: string, rules: { minLength: boolean, uppercase: boolean, lowercase: boolean, number: boolean, specialChar: boolean } }}
 */
export function validatePasswordDetailed(password) {
  const val = password || '';
  const rules = {
    minLength: val.length >= CONFIG.PASSWORD_RULES.minLength,
    uppercase: CONFIG.PASSWORD_RULES.uppercaseRegex.test(val),
    lowercase: CONFIG.PASSWORD_RULES.lowercaseRegex.test(val),
    number: CONFIG.PASSWORD_RULES.numberRegex.test(val),
    specialChar: CONFIG.PASSWORD_RULES.specialCharRegex.test(val)
  };

  if (!val) {
    return {
      isValid: false,
      message: 'Password is required',
      rules
    };
  }

  if (!rules.minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${CONFIG.PASSWORD_RULES.minLength} characters`,
      rules
    };
  }
  if (!rules.uppercase) {
    return {
      isValid: false,
      message: 'Password must contain at least 1 uppercase letter',
      rules
    };
  }
  if (!rules.lowercase) {
    return {
      isValid: false,
      message: 'Password must contain at least 1 lowercase letter',
      rules
    };
  }
  if (!rules.number) {
    return {
      isValid: false,
      message: 'Password must contain at least 1 number',
      rules
    };
  }
  if (!rules.specialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least 1 special character',
      rules
    };
  }

  return {
    isValid: true,
    message: '',
    rules
  };
}

/**
 * Standard password validation
 * @param {string} password 
 * @param {boolean} checkComplexity 
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
    const detailed = validatePasswordDetailed(password);
    return {
      isValid: detailed.isValid,
      message: detailed.message
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validates confirm password
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return {
      isValid: false,
      message: 'Confirm password is required'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match'
    };
  }

  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validates Terms and Conditions acceptance
 * @param {boolean} agreed 
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateTerms(agreed) {
  if (!agreed) {
    return {
      isValid: false,
      message: 'You must agree to the Terms & Conditions and Privacy Policy'
    };
  }

  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validates login form
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

/**
 * Validates register form
 * @param {{ name: string, email: string, phone: string, password: string, confirmPassword: string, termsAgreed: boolean }} data 
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateRegisterForm({ name, email, phone, password, confirmPassword, termsAgreed }) {
  const nameResult = validateFullName(name);
  const emailResult = validateEmail(email);
  const phoneResult = validatePhoneNumber(phone);
  const passwordResult = validatePasswordDetailed(password);
  const confirmResult = validateConfirmPassword(password, confirmPassword);
  const termsResult = validateTerms(termsAgreed);

  const errors = {};
  if (!nameResult.isValid) errors.name = nameResult.message;
  if (!emailResult.isValid) errors.email = emailResult.message;
  if (!phoneResult.isValid) errors.phone = phoneResult.message;
  if (!passwordResult.isValid) errors.password = passwordResult.message;
  if (!confirmResult.isValid) errors.confirmPassword = confirmResult.message;
  if (!termsResult.isValid) errors.terms = termsResult.message;

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors
  };
}

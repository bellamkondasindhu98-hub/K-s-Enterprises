/**
 * K's ENTERPRISES - Fish Feed Company
 * Automated Verification & Unit Test Suite (Login, Register & Auth)
 */

import assert from 'node:assert';
import { 
  validateEmail, 
  validatePassword, 
  validateLoginForm,
  validateFullName,
  validatePhoneNumber,
  validatePasswordDetailed,
  validateConfirmPassword,
  validateTerms,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm
} from '../js/validation.js';
import { CONFIG } from '../js/config.js';

// Polyfill minimal browser localStorage/sessionStorage for Node test environment
if (typeof window === 'undefined') {
  global.localStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { this.store = {}; }
  };
  global.sessionStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { this.store = {}; }
  };
  global.btoa = (str) => Buffer.from(str).toString('base64');
}

import { authService } from '../js/authService.js';

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${name}`);
    console.error(`    ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n======================================================');
console.log("  Running Test Suite: K's ENTERPRISES Auth & Forgot Password");
console.log('======================================================\n');

// 1. FULL NAME VALIDATION
console.log('--- 1. Full Name Validation ---');
runTest('Should fail when full name is empty', () => {
  const res = validateFullName('');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Full name is required');
});

runTest('Should fail when full name is less than 2 characters', () => {
  const res = validateFullName('A');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Full name must be at least 2 characters');
});

runTest('Should pass for valid full names', () => {
  const res = validateFullName('Rajesh Sharma');
  assert.strictEqual(res.isValid, true);
});

// 2. EMAIL VALIDATION
console.log('\n--- 2. Email Validation ---');
runTest('Should fail when email is empty', () => {
  const res = validateEmail('');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Email is required');
});

runTest('Should fail when email format is invalid with clear message', () => {
  const invalidEmails = ['plainaddress', '@missinguser.com', 'user@domain', 'user@.com'];
  for (const email of invalidEmails) {
    const res = validateEmail(email);
    assert.strictEqual(res.isValid, false, `Failed on ${email}`);
    assert.strictEqual(res.message, 'Please enter a valid email address');
  }
});

runTest('Should pass on valid standard emails', () => {
  const validEmails = ['demo@gmail.com', 'rajesh@ksenterprises.com', 'aquafarm.south@domain.co.in'];
  for (const email of validEmails) {
    const res = validateEmail(email);
    assert.strictEqual(res.isValid, true, `Failed on ${email}`);
  }
});

// 3. INDIAN PHONE NUMBER VALIDATION
console.log('\n--- 3. Indian Phone Number Validation ---');
runTest('Should fail when phone is empty', () => {
  const res = validatePhoneNumber('');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Phone number is required');
});

runTest('Should fail on invalid phone numbers', () => {
  const invalidPhones = ['12345', '98765432', '5555555555', 'abcdefghij', '+1 5551234567'];
  for (const phone of invalidPhones) {
    const res = validatePhoneNumber(phone);
    assert.strictEqual(res.isValid, false, `Expected invalid for ${phone}`);
  }
});

runTest('Should accept valid Indian mobile numbers in multiple formats (+91, spaces, 10 digits)', () => {
  const validPhones = [
    '9876543210',
    '+91 9876543210',
    '+919876543210',
    '09876543210',
    '+91-98765-43210',
    '8123456789',
    '7012345678',
    '6301234567'
  ];
  for (const phone of validPhones) {
    const res = validatePhoneNumber(phone);
    assert.strictEqual(res.isValid, true, `Expected valid for ${phone}`);
  }
});

// 4. PASSWORD & CONFIRM PASSWORD VALIDATION
console.log('\n--- 4. Password Complexity & Matching ---');
runTest('Should check all 5 password criteria individually', () => {
  const res1 = validatePasswordDetailed('Demo@123');
  assert.strictEqual(res1.isValid, true);
  assert.strictEqual(res1.rules.minLength, true);
  assert.strictEqual(res1.rules.uppercase, true);
  assert.strictEqual(res1.rules.lowercase, true);
  assert.strictEqual(res1.rules.number, true);
  assert.strictEqual(res1.rules.specialChar, true);

  const res2 = validatePasswordDetailed('demo123'); // missing uppercase & special char & too short
  assert.strictEqual(res2.isValid, false);
  assert.strictEqual(res2.rules.minLength, false);
  assert.strictEqual(res2.rules.uppercase, false);
  assert.strictEqual(res2.rules.specialChar, false);
});

runTest('Should fail when confirm password is empty', () => {
  const res = validateConfirmPassword('Demo@123', '');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Confirm password is required');
});

runTest('Should fail when confirm password does not match', () => {
  const res = validateConfirmPassword('Demo@123', 'Demo@124');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Passwords do not match');
});

runTest('Should pass when confirm password matches', () => {
  const res = validateConfirmPassword('Demo@123', 'Demo@123');
  assert.strictEqual(res.isValid, true);
});

// 5. TERMS & CONDITIONS VALIDATION
console.log('\n--- 5. Terms & Conditions Validation ---');
runTest('Should fail when terms are not agreed', () => {
  const res = validateTerms(false);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'You must agree to the Terms & Conditions and Privacy Policy');
});

runTest('Should pass when terms are agreed', () => {
  const res = validateTerms(true);
  assert.strictEqual(res.isValid, true);
});

// 6. COMPOSITE REGISTRATION FORM VALIDATION
console.log('\n--- 6. Composite Registration Form Validation ---');
runTest('Should flag all missing fields on empty submission', () => {
  const res = validateRegisterForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.name, 'Full name is required');
  assert.strictEqual(res.errors.email, 'Email is required');
  assert.strictEqual(res.errors.phone, 'Phone number is required');
  assert.strictEqual(res.errors.password, 'Password is required');
  assert.strictEqual(res.errors.confirmPassword, 'Confirm password is required');
  assert.strictEqual(res.errors.terms, 'You must agree to the Terms & Conditions and Privacy Policy');
});

runTest('Should pass when all fields are valid', () => {
  const res = validateRegisterForm({
    name: 'Suresh Verma',
    email: 'suresh@aquafarm.in',
    phone: '+91 9876543210',
    password: 'Demo@123',
    confirmPassword: 'Demo@123',
    termsAgreed: true
  });
  assert.strictEqual(res.isValid, true);
  assert.deepStrictEqual(res.errors, {});
});

// 7. FORGOT PASSWORD FORM VALIDATION
console.log('\n--- 7. Forgot Password Form Validation ---');
runTest('Should fail when forgot password email is empty', () => {
  const res = validateForgotPasswordForm('');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Email is required');
});

runTest('Should fail when forgot password email is malformed', () => {
  const res = validateForgotPasswordForm('bad-email-format');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Please enter a valid email address');
});

runTest('Should pass when forgot password email is valid', () => {
  const res = validateForgotPasswordForm('manager@aquafarm.com');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.errors.email, undefined);
});

// 8. RESET PASSWORD FORM VALIDATION
console.log('\n--- 8. Reset Password Form Validation ---');
runTest('Should fail when reset password fields are empty or invalid', () => {
  const res = validateResetPasswordForm('', '');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.password, 'Password is required');
  assert.strictEqual(res.errors.confirmPassword, 'Confirm password is required');
});

runTest('Should fail when reset password and confirm password do not match', () => {
  const res = validateResetPasswordForm('Demo@123', 'Different@123');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.confirmPassword, 'Passwords do not match');
});

runTest('Should pass when reset password is strong and matching', () => {
  const res = validateResetPasswordForm('FreshAqua@2026', 'FreshAqua@2026');
  assert.strictEqual(res.isValid, true);
  assert.deepStrictEqual(res.errors, {});
});

// 9. AUTH SERVICE - REGISTRATION, LOGIN & FORGOT PASSWORD FLOWS
console.log('\n--- 9. Auth Service: Registration, Login & Forgot Password ---');
(async () => {
  await runAsyncTest('Should prevent registration with duplicate email (demo@gmail.com)', async () => {
    const res = await authService.register({
      name: 'Duplicate Test',
      email: 'demo@gmail.com',
      phone: '+91 9876543210',
      password: 'Demo@123'
    });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.duplicateEmail, true);
    assert.strictEqual(res.message, 'An account with this email already exists. Please login.');
  });

  await runAsyncTest('Should successfully register a new user with role CUSTOMER', async () => {
    const newEmail = `farmer_${Date.now()}@aquafarm.in`;
    const res = await authService.register({
      name: 'Vikram Patel',
      email: newEmail,
      phone: '+91 9876500000',
      password: 'Demo@123'
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.message, 'Account created successfully!');

    // Now test logging in with this newly registered user
    authService.logout();
    const loginRes = await authService.login(newEmail, 'Demo@123', true);
    assert.strictEqual(loginRes.success, true);
    assert.strictEqual(loginRes.user.name, 'Vikram Patel');
    assert.strictEqual(loginRes.user.role, 'CUSTOMER');
    assert.strictEqual(authService.isAuthenticated(), true);
  });

  await runAsyncTest('Should process password reset request and protect user enumeration', async () => {
    // Both existing and non-existing email return safe success message
    const res1 = await authService.requestPasswordReset('demo@gmail.com');
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.message, '✓ If an account exists for this email, a password reset link has been sent.');
    assert.strictEqual(typeof res1.token, 'string');
    assert.strictEqual(authService.getPendingResetEmail(), 'demo@gmail.com');

    const res2 = await authService.requestPasswordReset('nonexistent@example.com');
    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.message, '✓ If an account exists for this email, a password reset link has been sent.');
  });

  await runAsyncTest('Should simulate resetting password with new credentials', async () => {
    const reqRes = await authService.requestPasswordReset('demo@gmail.com');
    const resetRes = await authService.resetPassword(reqRes.token, 'NewDemo@2026');
    assert.strictEqual(resetRes.success, true);
    assert.strictEqual(resetRes.message, 'Password has been successfully reset! Please sign in with your new password.');
  });

  console.log('\n======================================================');
  console.log(`  Tests Completed: ${passedTests}/${totalTests} Passed`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
})();


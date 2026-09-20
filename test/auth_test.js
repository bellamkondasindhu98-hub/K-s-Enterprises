/**
 * K's ENTERPRISES - Fish Feed Company
 * Automated Verification & Unit Test Suite
 */

import assert from 'node:assert';
import { validateEmail, validatePassword, validateLoginForm } from '../js/validation.js';
import { CONFIG } from '../js/config.js';

// Polyfill minimal browser localStorage/sessionStorage for Node environment
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
console.log("  Running Test Suite: K's ENTERPRISES Auth & Validation");
console.log('======================================================\n');

// 1. EMAIL VALIDATION TESTS
console.log('--- 1. Email Validation ---');
runTest('Should fail when email is empty', () => {
  const res = validateEmail('');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Email is required');
});

runTest('Should fail when email format is invalid', () => {
  const invalidEmails = ['plainaddress', '@missingusername.com', 'user@domain', 'user@.com'];
  for (const email of invalidEmails) {
    const res = validateEmail(email);
    assert.strictEqual(res.isValid, false, `Failed on ${email}`);
    assert.strictEqual(res.message, 'Invalid email format');
  }
});

runTest('Should pass on valid standard emails', () => {
  const validEmails = ['demo@gmail.com', 'manager@ksenterprises.com', 'aqua_farm.12@domain.co.uk'];
  for (const email of validEmails) {
    const res = validateEmail(email);
    assert.strictEqual(res.isValid, true, `Failed on ${email}`);
    assert.strictEqual(res.message, '');
  }
});

// 2. PASSWORD VALIDATION TESTS
console.log('\n--- 2. Password Validation ---');
runTest('Should fail when password is empty', () => {
  const res = validatePassword('');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Password is required');
});

runTest('Should enforce 8-character minimum when complexity enabled', () => {
  const res = validatePassword('Demo@1', true);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Password must be at least 8 characters');
});

runTest('Should enforce uppercase requirement when complexity enabled', () => {
  const res = validatePassword('demo@123', true);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Password must contain at least 1 uppercase letter');
});

runTest('Should enforce special character requirement when complexity enabled', () => {
  const res = validatePassword('Demo12345', true);
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.message, 'Password must contain at least 1 special character');
});

runTest('Should accept valid demo password (Demo@123)', () => {
  const res = validatePassword('Demo@123', true);
  assert.strictEqual(res.isValid, true);
});

// 3. COMPOSITE FORM VALIDATION
console.log('\n--- 3. Form Composite Validation ---');
runTest('Should flag both required fields when submitting empty form', () => {
  const res = validateLoginForm('', '');
  assert.strictEqual(res.isValid, false);
  assert.strictEqual(res.errors.email, 'Email is required');
  assert.strictEqual(res.errors.password, 'Password is required');
});

runTest('Should pass when both fields are properly populated', () => {
  const res = validateLoginForm('demo@gmail.com', 'Demo@123');
  assert.strictEqual(res.isValid, true);
  assert.deepStrictEqual(res.errors, {});
});

// 4. AUTH SERVICE & DEMO LOGIN TESTS
console.log('\n--- 4. Authentication Service ---');
(async () => {
  await runAsyncTest('Should successfully authenticate with demo credentials', async () => {
    authService.logout();
    const result = await authService.login(CONFIG.DEMO_CREDENTIALS.email, CONFIG.DEMO_CREDENTIALS.password, true);
    assert.strictEqual(result.success, true);
    assert.ok(result.token.startsWith('ks_jwt_'));
    assert.strictEqual(result.user.email, 'demo@gmail.com');
    assert.strictEqual(authService.isAuthenticated(), true);
    assert.strictEqual(authService.getCurrentUser().name, 'Alex Morgan');
  });

  await runAsyncTest('Should reject login with wrong password', async () => {
    authService.logout();
    const result = await authService.login('demo@gmail.com', 'WrongPass123!');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid login credentials');
    assert.strictEqual(authService.isAuthenticated(), false);
  });

  await runAsyncTest('Should reject login with unregistered email', async () => {
    authService.logout();
    const result = await authService.login('unknown@farm.com', 'Demo@123');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid login credentials');
    assert.strictEqual(authService.isAuthenticated(), false);
  });

  await runAsyncTest('Should clear auth state on logout', async () => {
    await authService.login(CONFIG.DEMO_CREDENTIALS.email, CONFIG.DEMO_CREDENTIALS.password, false);
    assert.strictEqual(authService.isAuthenticated(), true);
    authService.logout();
    assert.strictEqual(authService.isAuthenticated(), false);
    assert.strictEqual(authService.getCurrentUser(), null);
  });

  console.log('\n======================================================');
  console.log(`  Tests Completed: ${passedTests}/${totalTests} Passed`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
})();

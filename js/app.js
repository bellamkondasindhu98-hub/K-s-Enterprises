/**
 * K's ENTERPRISES - Fish Feed Company
 * Main Application Controller (Login, Register & Protected Views)
 */

import { CONFIG } from './config.js';
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
} from './validation.js';
import { authService } from './authService.js';
import { Router } from './router.js';
import { MOCK_DATA } from './mockData.js';

class FishFeedApp {
  constructor() {
    this.router = null;
    this.elements = {};
  }

  init() {
    this.cacheElements();
    this.setupRouter();
    this.bindEvents();
    this.checkRememberedUser();
    this.router.init();
  }

  cacheElements() {
    // Auth Views Containers
    this.elements.viewContainer = document.getElementById('app-views');
    this.elements.viewLogin = document.getElementById('view-login');
    this.elements.viewRegister = document.getElementById('view-register');
    this.elements.viewForgotPassword = document.getElementById('view-forgot-password');
    this.elements.viewResetPassword = document.getElementById('view-reset-password');
    this.elements.viewHome = document.getElementById('view-home');
    this.elements.viewProducts = document.getElementById('view-products');
    this.elements.viewProfile = document.getElementById('view-profile');
    this.elements.viewCompany = document.getElementById('view-company');

    // Navigation & App Bar
    this.elements.mainNav = document.getElementById('main-nav');
    this.elements.navUserBadge = document.getElementById('nav-user-badge');
    this.elements.navUserName = document.getElementById('nav-user-name');
    this.elements.navUserRole = document.getElementById('nav-user-role');
    this.elements.logoutBtn = document.getElementById('logout-btn');
    this.elements.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.elements.navLinksContainer = document.getElementById('nav-links-container');

    // Login Form Elements
    this.elements.loginForm = document.getElementById('login-form');
    this.elements.emailInput = document.getElementById('email');
    this.elements.passwordInput = document.getElementById('password');
    this.elements.emailError = document.getElementById('email-error');
    this.elements.passwordError = document.getElementById('password-error');
    this.elements.togglePasswordBtn = document.getElementById('toggle-password');
    this.elements.togglePasswordIcon = document.getElementById('toggle-password-icon');
    this.elements.rememberMe = document.getElementById('remember-me');
    this.elements.loginBtn = document.getElementById('login-btn');
    this.elements.loginBtnText = document.getElementById('login-btn-text');
    this.elements.loginBtnSpinner = document.getElementById('login-btn-spinner');
    this.elements.formAlert = document.getElementById('form-alert');
    this.elements.demoFillBtn = document.getElementById('demo-fill-btn');
    this.elements.forgotPasswordLink = document.getElementById('forgot-password-link');

    // Register Form Elements
    this.elements.regForm = document.getElementById('register-form');
    this.elements.regName = document.getElementById('reg-name');
    this.elements.regNameError = document.getElementById('reg-name-error');
    this.elements.regEmail = document.getElementById('reg-email');
    this.elements.regEmailError = document.getElementById('reg-email-error');
    this.elements.regPhone = document.getElementById('reg-phone');
    this.elements.regPhoneError = document.getElementById('reg-phone-error');
    this.elements.regPassword = document.getElementById('reg-password');
    this.elements.regPasswordError = document.getElementById('reg-password-error');
    this.elements.toggleRegPasswordBtn = document.getElementById('toggle-reg-password');
    this.elements.toggleRegPasswordIcon = document.getElementById('toggle-reg-password-icon');
    this.elements.regConfirmPassword = document.getElementById('reg-confirm-password');
    this.elements.regConfirmPasswordError = document.getElementById('reg-confirm-password-error');
    this.elements.toggleRegConfirmPasswordBtn = document.getElementById('toggle-reg-confirm-password');
    this.elements.toggleRegConfirmPasswordIcon = document.getElementById('toggle-reg-confirm-password-icon');
    this.elements.regTerms = document.getElementById('reg-terms');
    this.elements.regTermsError = document.getElementById('reg-terms-error');
    this.elements.regSubmitBtn = document.getElementById('reg-submit-btn');
    this.elements.regBtnText = document.getElementById('reg-btn-text');
    this.elements.regBtnSpinner = document.getElementById('reg-btn-spinner');
    this.elements.regFormAlert = document.getElementById('reg-form-alert');
    this.elements.termsModalLink = document.getElementById('terms-modal-link');
    this.elements.privacyModalLink = document.getElementById('privacy-modal-link');

    // Forgot Password Form Elements
    this.elements.forgotForm = document.getElementById('forgot-password-form');
    this.elements.forgotEmail = document.getElementById('forgot-email');
    this.elements.forgotEmailError = document.getElementById('forgot-email-error');
    this.elements.forgotSubmitBtn = document.getElementById('forgot-submit-btn');
    this.elements.forgotBtnText = document.getElementById('forgot-btn-text');
    this.elements.forgotBtnSpinner = document.getElementById('forgot-btn-spinner');
    this.elements.forgotFormAlert = document.getElementById('forgot-form-alert');
    this.elements.forgotBackToLogin = document.getElementById('forgot-back-to-login');

    // Reset Password Form Elements
    this.elements.resetForm = document.getElementById('reset-password-form');
    this.elements.resetPasswordSubtitle = document.getElementById('reset-password-subtitle');
    this.elements.resetNewPassword = document.getElementById('reset-new-password');
    this.elements.resetNewPasswordError = document.getElementById('reset-new-password-error');
    this.elements.toggleResetNewPasswordBtn = document.getElementById('toggle-reset-new-password');
    this.elements.toggleResetNewPasswordIcon = document.getElementById('toggle-reset-new-password-icon');
    this.elements.resetConfirmPassword = document.getElementById('reset-confirm-password');
    this.elements.resetConfirmPasswordError = document.getElementById('reset-confirm-password-error');
    this.elements.toggleResetConfirmPasswordBtn = document.getElementById('toggle-reset-confirm-password');
    this.elements.toggleResetConfirmPasswordIcon = document.getElementById('toggle-reset-confirm-password-icon');
    this.elements.resetSubmitBtn = document.getElementById('reset-submit-btn');
    this.elements.resetBtnText = document.getElementById('reset-btn-text');
    this.elements.resetBtnSpinner = document.getElementById('reset-btn-spinner');
    this.elements.resetFormAlert = document.getElementById('reset-form-alert');
    this.elements.resetRules = {
      length: document.getElementById('reset-rule-length'),
      uppercase: document.getElementById('reset-rule-uppercase'),
      lowercase: document.getElementById('reset-rule-lowercase'),
      number: document.getElementById('reset-rule-number'),
      special: document.getElementById('reset-rule-special')
    };

    // Password Rules Checklist Elements (Register)
    this.elements.rules = {
      length: document.getElementById('rule-length'),
      uppercase: document.getElementById('rule-uppercase'),
      lowercase: document.getElementById('rule-lowercase'),
      number: document.getElementById('rule-number'),
      special: document.getElementById('rule-special')
    };

    // Modals
    this.elements.modalContainer = document.getElementById('modal-container');
    this.elements.modalTitle = document.getElementById('modal-title');
    this.elements.modalBody = document.getElementById('modal-body');
    this.elements.modalClose = document.getElementById('modal-close');
  }

  setupRouter() {
    this.router = new Router(
      ['/login', '/register', '/forgot-password', '/reset-password', '/home', '/products', '/profile', '/company'],
      (currentPath, flashMessage) => this.handleRouteView(currentPath, flashMessage)
    );
  }

  bindEvents() {
    // ------------------------------------------------------------------------
    // LOGIN FORM EVENTS
    // ------------------------------------------------------------------------
    if (this.elements.loginForm) {
      this.elements.loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
    }

    if (this.elements.emailInput) {
      this.elements.emailInput.addEventListener('blur', () => this.validateLoginEmailField());
      this.elements.emailInput.addEventListener('input', () => {
        if (this.elements.emailInput.classList.contains('input-invalid')) {
          this.validateLoginEmailField();
        }
      });
    }

    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener('blur', () => this.validateLoginPasswordField());
      this.elements.passwordInput.addEventListener('input', () => {
        if (this.elements.passwordInput.classList.contains('input-invalid')) {
          this.validateLoginPasswordField();
        }
      });
    }

    if (this.elements.togglePasswordBtn) {
      this.elements.togglePasswordBtn.addEventListener('click', () => {
        this.toggleInputType(this.elements.passwordInput, this.elements.togglePasswordBtn, this.elements.togglePasswordIcon);
      });
    }

    if (this.elements.demoFillBtn) {
      this.elements.demoFillBtn.addEventListener('click', () => this.fillDemoCredentials());
    }

    // ------------------------------------------------------------------------
    // REGISTER FORM EVENTS
    // ------------------------------------------------------------------------
    if (this.elements.regForm) {
      this.elements.regForm.addEventListener('submit', (e) => this.handleRegisterSubmit(e));
    }

    if (this.elements.regName) {
      this.elements.regName.addEventListener('blur', () => this.validateRegNameField());
      this.elements.regName.addEventListener('input', () => {
        if (this.elements.regName.classList.contains('input-invalid')) {
          this.validateRegNameField();
        }
      });
    }

    if (this.elements.regEmail) {
      this.elements.regEmail.addEventListener('blur', () => this.validateRegEmailField());
      this.elements.regEmail.addEventListener('input', () => {
        if (this.elements.regEmail.classList.contains('input-invalid')) {
          this.validateRegEmailField();
        }
      });
    }

    if (this.elements.regPhone) {
      this.elements.regPhone.addEventListener('blur', () => this.validateRegPhoneField());
      this.elements.regPhone.addEventListener('input', () => {
        if (this.elements.regPhone.classList.contains('input-invalid')) {
          this.validateRegPhoneField();
        }
      });
    }

    if (this.elements.regPassword) {
      this.elements.regPassword.addEventListener('input', () => {
        this.updatePasswordCriteriaUI(this.elements.regPassword.value);
        if (this.elements.regPassword.classList.contains('input-invalid')) {
          this.validateRegPasswordField();
        }
        if (this.elements.regConfirmPassword?.value) {
          this.validateRegConfirmPasswordField();
        }
      });
      this.elements.regPassword.addEventListener('blur', () => this.validateRegPasswordField());
    }

    if (this.elements.toggleRegPasswordBtn) {
      this.elements.toggleRegPasswordBtn.addEventListener('click', () => {
        this.toggleInputType(this.elements.regPassword, this.elements.toggleRegPasswordBtn, this.elements.toggleRegPasswordIcon);
      });
    }

    if (this.elements.regConfirmPassword) {
      this.elements.regConfirmPassword.addEventListener('blur', () => this.validateRegConfirmPasswordField());
      this.elements.regConfirmPassword.addEventListener('input', () => {
        if (this.elements.regConfirmPassword.classList.contains('input-invalid')) {
          this.validateRegConfirmPasswordField();
        }
      });
    }

    if (this.elements.toggleRegConfirmPasswordBtn) {
      this.elements.toggleRegConfirmPasswordBtn.addEventListener('click', () => {
        this.toggleInputType(this.elements.regConfirmPassword, this.elements.toggleRegConfirmPasswordBtn, this.elements.toggleRegConfirmPasswordIcon);
      });
    }

    if (this.elements.regTerms) {
      this.elements.regTerms.addEventListener('change', () => this.validateRegTermsField());
    }

    if (this.elements.termsModalLink) {
      this.elements.termsModalLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal(
          'Terms & Conditions',
          `
            <div class="modal-text">
              <h4 style="color: var(--color-slate-900); margin-bottom: 0.5rem;">K's ENTERPRISES Commercial Feed Supply Agreement</h4>
              <p>By creating an account with K's ENTERPRISES, you agree to:</p>
              <ul style="margin: 0.75rem 0 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">
                <li>Maintain accurate commercial farm and aquaculture operational records.</li>
                <li>Store feed batches in moisture-controlled environments per ISO 22000 handling protocols.</li>
                <li>Use authentication credentials strictly for authorized farm managers and purchasing staff.</li>
              </ul>
              <div style="text-align: right; margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" onclick="window.app.closeModal()">I Understand</button>
              </div>
            </div>
          `
        );
      });
    }

    if (this.elements.privacyModalLink) {
      this.elements.privacyModalLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal(
          'Privacy Policy',
          `
            <div class="modal-text">
              <h4 style="color: var(--color-slate-900); margin-bottom: 0.5rem;">Aquaculture Data Protection</h4>
              <p>K's ENTERPRISES respects your commercial privacy. Your contact details and feed formulation requirements are safeguarded with industry-grade encryption and never shared with unauthorized third parties.</p>
              <div style="text-align: right; margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" onclick="window.app.closeModal()">Close</button>
              </div>
            </div>
          `
        );
      });
    }

    // ------------------------------------------------------------------------
    // FORGOT PASSWORD FORM EVENTS
    // ------------------------------------------------------------------------
    if (this.elements.forgotForm) {
      this.elements.forgotForm.addEventListener('submit', (e) => this.handleForgotPasswordSubmit(e));
    }

    if (this.elements.forgotEmail) {
      this.elements.forgotEmail.addEventListener('blur', () => this.validateForgotEmailField());
      this.elements.forgotEmail.addEventListener('input', () => {
        if (this.elements.forgotEmail.classList.contains('input-invalid')) {
          this.validateForgotEmailField();
        }
      });
    }

    // ------------------------------------------------------------------------
    // RESET PASSWORD FORM EVENTS
    // ------------------------------------------------------------------------
    if (this.elements.resetForm) {
      this.elements.resetForm.addEventListener('submit', (e) => this.handleResetPasswordSubmit(e));
    }

    if (this.elements.resetNewPassword) {
      this.elements.resetNewPassword.addEventListener('input', () => {
        this.updateResetPasswordCriteriaUI(this.elements.resetNewPassword.value);
        if (this.elements.resetNewPassword.classList.contains('input-invalid')) {
          this.validateResetNewPasswordField();
        }
        if (this.elements.resetConfirmPassword?.value) {
          this.validateResetConfirmPasswordField();
        }
      });
      this.elements.resetNewPassword.addEventListener('blur', () => this.validateResetNewPasswordField());
    }

    if (this.elements.toggleResetNewPasswordBtn) {
      this.elements.toggleResetNewPasswordBtn.addEventListener('click', () => {
        this.toggleInputType(this.elements.resetNewPassword, this.elements.toggleResetNewPasswordBtn, this.elements.toggleResetNewPasswordIcon);
      });
    }

    if (this.elements.resetConfirmPassword) {
      this.elements.resetConfirmPassword.addEventListener('blur', () => this.validateResetConfirmPasswordField());
      this.elements.resetConfirmPassword.addEventListener('input', () => {
        if (this.elements.resetConfirmPassword.classList.contains('input-invalid')) {
          this.validateResetConfirmPasswordField();
        }
      });
    }

    if (this.elements.toggleResetConfirmPasswordBtn) {
      this.elements.toggleResetConfirmPasswordBtn.addEventListener('click', () => {
        this.toggleInputType(this.elements.resetConfirmPassword, this.elements.toggleResetConfirmPasswordBtn, this.elements.toggleResetConfirmPasswordIcon);
      });
    }

    // ------------------------------------------------------------------------
    // GLOBAL ROUTING & NAVIGATION
    // ------------------------------------------------------------------------
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.router.navigate(route);
        if (this.elements.navLinksContainer) {
          this.elements.navLinksContainer.classList.remove('active');
        }
      }
    });

    if (this.elements.logoutBtn) {
      this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    if (this.elements.mobileMenuBtn) {
      this.elements.mobileMenuBtn.addEventListener('click', () => {
        if (this.elements.navLinksContainer) {
          this.elements.navLinksContainer.classList.toggle('active');
        }
      });
    }

    if (this.elements.forgotPasswordLink) {
      this.elements.forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/forgot-password');
      });
    }

    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', () => this.closeModal());
    }
    if (this.elements.modalContainer) {
      this.elements.modalContainer.addEventListener('click', (e) => {
        if (e.target === this.elements.modalContainer) {
          this.closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.modalContainer && !this.elements.modalContainer.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }

  checkRememberedUser() {
    const rememberedEmail = authService.getRememberedEmail();
    if (rememberedEmail && this.elements.emailInput) {
      this.elements.emailInput.value = rememberedEmail;
      if (this.elements.rememberMe) {
        this.elements.rememberMe.checked = true;
      }
    }
  }

  // --------------------------------------------------------------------------
  // FIELD VALIDATION HELPERS - LOGIN
  // --------------------------------------------------------------------------
  validateLoginEmailField() {
    const email = this.elements.emailInput.value;
    const result = validateEmail(email);
    if (!result.isValid) {
      this.showFieldError(this.elements.emailInput, this.elements.emailError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.emailInput, this.elements.emailError);
      return true;
    }
  }

  validateLoginPasswordField() {
    const password = this.elements.passwordInput.value;
    const result = validatePassword(password, false);
    if (!result.isValid) {
      this.showFieldError(this.elements.passwordInput, this.elements.passwordError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.passwordInput, this.elements.passwordError);
      return true;
    }
  }

  // --------------------------------------------------------------------------
  // FIELD VALIDATION HELPERS - REGISTER
  // --------------------------------------------------------------------------
  validateRegNameField() {
    const name = this.elements.regName.value;
    const result = validateFullName(name);
    if (!result.isValid) {
      this.showFieldError(this.elements.regName, this.elements.regNameError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.regName, this.elements.regNameError);
      return true;
    }
  }

  validateRegEmailField() {
    const email = this.elements.regEmail.value;
    const result = validateEmail(email);
    if (!result.isValid) {
      this.showFieldError(this.elements.regEmail, this.elements.regEmailError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.regEmail, this.elements.regEmailError);
      return true;
    }
  }

  validateRegPhoneField() {
    const phone = this.elements.regPhone.value;
    const result = validatePhoneNumber(phone);
    if (!result.isValid) {
      this.showFieldError(this.elements.regPhone, this.elements.regPhoneError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.regPhone, this.elements.regPhoneError);
      return true;
    }
  }

  validateRegPasswordField() {
    const password = this.elements.regPassword.value;
    const result = validatePasswordDetailed(password);
    if (!result.isValid) {
      this.showFieldError(this.elements.regPassword, this.elements.regPasswordError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.regPassword, this.elements.regPasswordError);
      return true;
    }
  }

  validateRegConfirmPasswordField() {
    const password = this.elements.regPassword.value;
    const confirmPassword = this.elements.regConfirmPassword.value;
    const result = validateConfirmPassword(password, confirmPassword);
    if (!result.isValid) {
      this.showFieldError(this.elements.regConfirmPassword, this.elements.regConfirmPasswordError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.regConfirmPassword, this.elements.regConfirmPasswordError);
      return true;
    }
  }

  validateRegTermsField() {
    const agreed = this.elements.regTerms ? this.elements.regTerms.checked : false;
    const result = validateTerms(agreed);
    if (!result.isValid) {
      if (this.elements.regTermsError) {
        this.elements.regTermsError.textContent = result.message;
        this.elements.regTermsError.classList.remove('hidden');
      }
      return false;
    } else {
      if (this.elements.regTermsError) {
        this.elements.regTermsError.textContent = '';
        this.elements.regTermsError.classList.add('hidden');
      }
      return true;
    }
  }

  updatePasswordCriteriaUI(password) {
    const result = validatePasswordDetailed(password);
    const rules = result.rules;

    this.updateRuleItem(this.elements.rules.length, rules.minLength);
    this.updateRuleItem(this.elements.rules.uppercase, rules.uppercase);
    this.updateRuleItem(this.elements.rules.lowercase, rules.lowercase);
    this.updateRuleItem(this.elements.rules.number, rules.number);
    this.updateRuleItem(this.elements.rules.special, rules.specialChar);
  }

  updateRuleItem(el, isPassed) {
    if (!el) return;
    const icon = el.querySelector('.rule-icon');
    if (isPassed) {
      el.classList.add('rule-passed');
      if (icon) icon.textContent = '✓';
    } else {
      el.classList.remove('rule-passed');
      if (icon) icon.textContent = '•';
    }
  }

  showFieldError(inputEl, errorEl, message) {
    if (inputEl) {
      inputEl.classList.add('input-invalid');
      inputEl.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  clearFieldError(inputEl, errorEl) {
    if (inputEl) {
      inputEl.classList.remove('input-invalid');
      inputEl.removeAttribute('aria-invalid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  showAlert(el, message, type = 'error', allowHtml = false) {
    if (!el) return;
    if (allowHtml) {
      el.innerHTML = message;
    } else {
      el.textContent = message;
    }
    el.className = `form-alert alert-${type}`;
    el.classList.remove('hidden');
    el.setAttribute('role', 'alert');
  }

  hideAlert(el) {
    if (!el) return;
    el.textContent = '';
    el.className = 'form-alert hidden';
  }

  toggleInputType(inputEl, btnEl, iconEl) {
    if (!inputEl) return;
    const isPassword = inputEl.getAttribute('type') === 'password';
    inputEl.setAttribute('type', isPassword ? 'text' : 'password');
    
    if (btnEl) {
      btnEl.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btnEl.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
    }

    if (iconEl) {
      if (isPassword) {
        iconEl.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        `;
      } else {
        iconEl.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      }
    }
  }

  fillDemoCredentials() {
    this.elements.emailInput.value = CONFIG.DEMO_CREDENTIALS.email;
    this.elements.passwordInput.value = CONFIG.DEMO_CREDENTIALS.password;
    this.clearFieldError(this.elements.emailInput, this.elements.emailError);
    this.clearFieldError(this.elements.passwordInput, this.elements.passwordError);
    this.hideAlert(this.elements.formAlert);
    
    this.elements.emailInput.classList.add('input-highlight');
    this.elements.passwordInput.classList.add('input-highlight');
    setTimeout(() => {
      this.elements.emailInput.classList.remove('input-highlight');
      this.elements.passwordInput.classList.remove('input-highlight');
    }, 800);

    this.showAlert(this.elements.formAlert, 'Demo credentials populated. Click "Sign In" to enter.', 'info');
  }

  // --------------------------------------------------------------------------
  // LOGIN SUBMIT
  // --------------------------------------------------------------------------
  async handleLoginSubmit(e) {
    e.preventDefault();
    this.clearFieldError(this.elements.emailInput, this.elements.emailError);
    this.clearFieldError(this.elements.passwordInput, this.elements.passwordError);
    this.hideAlert(this.elements.formAlert);

    const email = this.elements.emailInput.value;
    const password = this.elements.passwordInput.value;
    const rememberMe = this.elements.rememberMe ? this.elements.rememberMe.checked : false;

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      if (validation.errors.email) {
        this.showFieldError(this.elements.emailInput, this.elements.emailError, validation.errors.email);
      }
      if (validation.errors.password) {
        this.showFieldError(this.elements.passwordInput, this.elements.passwordError, validation.errors.password);
      }

      if (validation.errors.email) {
        this.elements.emailInput.focus();
      } else if (validation.errors.password) {
        this.elements.passwordInput.focus();
      }
      return;
    }

    this.setLoginButtonLoading(true);

    try {
      const result = await authService.login(email, password, rememberMe);

      if (result.success) {
        this.showAlert(this.elements.formAlert, 'Authentication successful! Redirecting to aquaculture portal...', 'success');
        this.elements.loginBtnText.textContent = 'Welcome Back!';

        setTimeout(() => {
          this.setLoginButtonLoading(false);
          this.router.navigate('/home');
        }, 500);
      } else {
        this.setLoginButtonLoading(false);
        this.showAlert(this.elements.formAlert, result.message || 'Invalid login credentials', 'error');
        this.showFieldError(this.elements.passwordInput, this.elements.passwordError, 'Invalid login credentials');
        this.elements.passwordInput.focus();
      }
    } catch (err) {
      this.setLoginButtonLoading(false);
      console.error('Login error:', err);
      this.showAlert(this.elements.formAlert, 'An unexpected error occurred during login. Please try again.', 'error');
    }
  }

  setLoginButtonLoading(isLoading) {
    if (!this.elements.loginBtn) return;
    this.elements.loginBtn.disabled = isLoading;
    if (isLoading) {
      this.elements.loginBtn.classList.add('btn-loading');
      this.elements.loginBtnSpinner.classList.remove('hidden');
      this.elements.loginBtnText.textContent = 'Verifying credentials...';
    } else {
      this.elements.loginBtn.classList.remove('btn-loading');
      this.elements.loginBtnSpinner.classList.add('hidden');
      this.elements.loginBtnText.textContent = 'Sign In to Portal';
    }
  }

  // --------------------------------------------------------------------------
  // REGISTER SUBMIT
  // --------------------------------------------------------------------------
  async handleRegisterSubmit(e) {
    e.preventDefault();
    this.clearFieldError(this.elements.regName, this.elements.regNameError);
    this.clearFieldError(this.elements.regEmail, this.elements.regEmailError);
    this.clearFieldError(this.elements.regPhone, this.elements.regPhoneError);
    this.clearFieldError(this.elements.regPassword, this.elements.regPasswordError);
    this.clearFieldError(this.elements.regConfirmPassword, this.elements.regConfirmPasswordError);
    if (this.elements.regTermsError) this.elements.regTermsError.classList.add('hidden');
    this.hideAlert(this.elements.regFormAlert);

    const formData = {
      name: this.elements.regName.value,
      email: this.elements.regEmail.value,
      phone: this.elements.regPhone.value,
      password: this.elements.regPassword.value,
      confirmPassword: this.elements.regConfirmPassword.value,
      termsAgreed: this.elements.regTerms ? this.elements.regTerms.checked : false
    };

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      if (validation.errors.name) this.showFieldError(this.elements.regName, this.elements.regNameError, validation.errors.name);
      if (validation.errors.email) this.showFieldError(this.elements.regEmail, this.elements.regEmailError, validation.errors.email);
      if (validation.errors.phone) this.showFieldError(this.elements.regPhone, this.elements.regPhoneError, validation.errors.phone);
      if (validation.errors.password) this.showFieldError(this.elements.regPassword, this.elements.regPasswordError, validation.errors.password);
      if (validation.errors.confirmPassword) this.showFieldError(this.elements.regConfirmPassword, this.elements.regConfirmPasswordError, validation.errors.confirmPassword);
      if (validation.errors.terms && this.elements.regTermsError) {
        this.elements.regTermsError.textContent = validation.errors.terms;
        this.elements.regTermsError.classList.remove('hidden');
      }

      // Focus first erroneous field
      if (validation.errors.name) this.elements.regName.focus();
      else if (validation.errors.email) this.elements.regEmail.focus();
      else if (validation.errors.phone) this.elements.regPhone.focus();
      else if (validation.errors.password) this.elements.regPassword.focus();
      else if (validation.errors.confirmPassword) this.elements.regConfirmPassword.focus();
      return;
    }

    this.setRegisterButtonLoading(true);

    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (result.success) {
        this.showAlert(this.elements.regFormAlert, 'Account created successfully! Redirecting to login...', 'success');
        this.elements.regBtnText.textContent = 'Account Created!';

        setTimeout(() => {
          this.setRegisterButtonLoading(false);
          // Pre-populate email on login page for convenience
          if (this.elements.emailInput) {
            this.elements.emailInput.value = formData.email;
          }
          this.router.navigate('/login', 'Account created successfully! Please login with your credentials.');
        }, 800);
      } else if (result.duplicateEmail) {
        this.setRegisterButtonLoading(false);
        const dupHtml = `An account with this email already exists. <a href="#login" data-route="/login" style="color: inherit; text-decoration: underline; font-weight: 700;">Please login.</a>`;
        this.showAlert(this.elements.regFormAlert, dupHtml, 'warning', true);
        this.showFieldError(this.elements.regEmail, this.elements.regEmailError, 'An account with this email already exists.');
        this.elements.regEmail.focus();
      } else {
        this.setRegisterButtonLoading(false);
        this.showAlert(this.elements.regFormAlert, result.message || 'Registration failed. Please check your details.', 'error');
      }
    } catch (err) {
      this.setRegisterButtonLoading(false);
      console.error('Registration error:', err);
      this.showAlert(this.elements.regFormAlert, 'An unexpected error occurred during registration. Please try again.', 'error');
    }
  }

  setRegisterButtonLoading(isLoading) {
    if (!this.elements.regSubmitBtn) return;
    this.elements.regSubmitBtn.disabled = isLoading;
    if (isLoading) {
      this.elements.regSubmitBtn.classList.add('btn-loading');
      this.elements.regBtnSpinner.classList.remove('hidden');
      this.elements.regBtnText.textContent = 'Creating account...';
    } else {
      this.elements.regSubmitBtn.classList.remove('btn-loading');
      this.elements.regBtnSpinner.classList.add('hidden');
      this.elements.regBtnText.textContent = 'CREATE ACCOUNT';
    }
  }

  // --------------------------------------------------------------------------
  // FIELD VALIDATION HELPERS - FORGOT PASSWORD
  // --------------------------------------------------------------------------
  validateForgotEmailField() {
    if (!this.elements.forgotEmail) return false;
    const email = this.elements.forgotEmail.value;
    const result = validateEmail(email);
    if (!result.isValid) {
      this.showFieldError(this.elements.forgotEmail, this.elements.forgotEmailError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.forgotEmail, this.elements.forgotEmailError);
      return true;
    }
  }

  // --------------------------------------------------------------------------
  // FORGOT PASSWORD SUBMIT
  // --------------------------------------------------------------------------
  async handleForgotPasswordSubmit(e) {
    e.preventDefault();
    if (!this.elements.forgotEmail) return;

    this.clearFieldError(this.elements.forgotEmail, this.elements.forgotEmailError);
    this.hideAlert(this.elements.forgotFormAlert);

    const email = this.elements.forgotEmail.value;
    const validation = validateForgotPasswordForm(email);

    if (!validation.isValid) {
      if (validation.errors.email) {
        this.showFieldError(this.elements.forgotEmail, this.elements.forgotEmailError, validation.errors.email);
        this.elements.forgotEmail.focus();
      }
      return;
    }

    this.setForgotPasswordButtonLoading(true);

    try {
      const result = await authService.requestPasswordReset(email);

      if (result.success) {
        this.showAlert(
          this.elements.forgotFormAlert,
          '✓ If an account exists for this email, a password reset link has been sent.',
          'success'
        );
        if (this.elements.forgotBtnText) {
          this.elements.forgotBtnText.textContent = '✓ Reset link sent successfully!';
        }

        setTimeout(() => {
          this.setForgotPasswordButtonLoading(false);
          this.router.navigate('/reset-password', 'Reset link verified. Enter your new password below.');
        }, 1200);
      } else {
        this.setForgotPasswordButtonLoading(false);
        this.showAlert(this.elements.forgotFormAlert, result.message || 'Unable to process reset request.', 'error');
      }
    } catch (err) {
      this.setForgotPasswordButtonLoading(false);
      console.error('Forgot password error:', err);
      this.showAlert(this.elements.forgotFormAlert, 'An unexpected error occurred. Please try again.', 'error');
    }
  }

  setForgotPasswordButtonLoading(isLoading) {
    if (!this.elements.forgotSubmitBtn) return;
    this.elements.forgotSubmitBtn.disabled = isLoading;
    if (isLoading) {
      this.elements.forgotSubmitBtn.classList.add('btn-loading');
      if (this.elements.forgotBtnSpinner) this.elements.forgotBtnSpinner.classList.remove('hidden');
      if (this.elements.forgotBtnText) this.elements.forgotBtnText.textContent = 'Sending reset link...';
    } else {
      this.elements.forgotSubmitBtn.classList.remove('btn-loading');
      if (this.elements.forgotBtnSpinner) this.elements.forgotBtnSpinner.classList.add('hidden');
      if (this.elements.forgotBtnText) this.elements.forgotBtnText.textContent = 'SEND RESET LINK';
    }
  }

  // --------------------------------------------------------------------------
  // FIELD VALIDATION HELPERS - RESET PASSWORD
  // --------------------------------------------------------------------------
  validateResetNewPasswordField() {
    if (!this.elements.resetNewPassword) return false;
    const password = this.elements.resetNewPassword.value;
    const result = validatePasswordDetailed(password);
    if (!result.isValid) {
      this.showFieldError(this.elements.resetNewPassword, this.elements.resetNewPasswordError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.resetNewPassword, this.elements.resetNewPasswordError);
      return true;
    }
  }

  validateResetConfirmPasswordField() {
    if (!this.elements.resetConfirmPassword) return false;
    const password = this.elements.resetNewPassword ? this.elements.resetNewPassword.value : '';
    const confirmPassword = this.elements.resetConfirmPassword.value;
    const result = validateConfirmPassword(password, confirmPassword);
    if (!result.isValid) {
      this.showFieldError(this.elements.resetConfirmPassword, this.elements.resetConfirmPasswordError, result.message);
      return false;
    } else {
      this.clearFieldError(this.elements.resetConfirmPassword, this.elements.resetConfirmPasswordError);
      return true;
    }
  }

  updateResetPasswordCriteriaUI(password) {
    if (!this.elements.resetRules) return;
    const result = validatePasswordDetailed(password);
    const rules = result.rules;

    this.updateRuleItem(this.elements.resetRules.length, rules.minLength);
    this.updateRuleItem(this.elements.resetRules.uppercase, rules.uppercase);
    this.updateRuleItem(this.elements.resetRules.lowercase, rules.lowercase);
    this.updateRuleItem(this.elements.resetRules.number, rules.number);
    this.updateRuleItem(this.elements.resetRules.special, rules.specialChar);
  }

  // --------------------------------------------------------------------------
  // RESET PASSWORD SUBMIT
  // --------------------------------------------------------------------------
  async handleResetPasswordSubmit(e) {
    e.preventDefault();
    if (!this.elements.resetNewPassword || !this.elements.resetConfirmPassword) return;

    this.clearFieldError(this.elements.resetNewPassword, this.elements.resetNewPasswordError);
    this.clearFieldError(this.elements.resetConfirmPassword, this.elements.resetConfirmPasswordError);
    this.hideAlert(this.elements.resetFormAlert);

    const password = this.elements.resetNewPassword.value;
    const confirmPassword = this.elements.resetConfirmPassword.value;

    const validation = validateResetPasswordForm(password, confirmPassword);
    if (!validation.isValid) {
      if (validation.errors.password) {
        this.showFieldError(this.elements.resetNewPassword, this.elements.resetNewPasswordError, validation.errors.password);
      }
      if (validation.errors.confirmPassword) {
        this.showFieldError(this.elements.resetConfirmPassword, this.elements.resetConfirmPasswordError, validation.errors.confirmPassword);
      }
      if (validation.errors.password) {
        this.elements.resetNewPassword.focus();
      } else if (validation.errors.confirmPassword) {
        this.elements.resetConfirmPassword.focus();
      }
      return;
    }

    this.setResetPasswordButtonLoading(true);

    try {
      const result = await authService.resetPassword('simulated_token', password);

      if (result.success) {
        this.showAlert(this.elements.resetFormAlert, 'Password updated successfully! Redirecting to login...', 'success');
        if (this.elements.resetBtnText) {
          this.elements.resetBtnText.textContent = 'Password Updated!';
        }

        setTimeout(() => {
          this.setResetPasswordButtonLoading(false);
          this.router.navigate('/login', 'Password reset successfully! Please sign in with your new credentials.');
        }, 1000);
      } else {
        this.setResetPasswordButtonLoading(false);
        this.showAlert(this.elements.resetFormAlert, result.message || 'Failed to update password.', 'error');
      }
    } catch (err) {
      this.setResetPasswordButtonLoading(false);
      console.error('Reset password error:', err);
      this.showAlert(this.elements.resetFormAlert, 'An unexpected error occurred. Please try again.', 'error');
    }
  }

  setResetPasswordButtonLoading(isLoading) {
    if (!this.elements.resetSubmitBtn) return;
    this.elements.resetSubmitBtn.disabled = isLoading;
    if (isLoading) {
      this.elements.resetSubmitBtn.classList.add('btn-loading');
      if (this.elements.resetBtnSpinner) this.elements.resetBtnSpinner.classList.remove('hidden');
      if (this.elements.resetBtnText) this.elements.resetBtnText.textContent = 'Updating password...';
    } else {
      this.elements.resetSubmitBtn.classList.remove('btn-loading');
      if (this.elements.resetBtnSpinner) this.elements.resetBtnSpinner.classList.add('hidden');
      if (this.elements.resetBtnText) this.elements.resetBtnText.textContent = 'UPDATE PASSWORD';
    }
  }

  handleLogout() {
    authService.logout();
    this.router.navigate('/login', 'You have been securely logged out.');
  }

  handleRouteView(currentPath, flashMessage) {
    const isAuth = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Toggle Main Nav visibility
    if (this.elements.mainNav) {
      if (['/login', '/register', '/forgot-password', '/reset-password'].includes(currentPath)) {
        this.elements.mainNav.classList.add('hidden');
      } else {
        this.elements.mainNav.classList.remove('hidden');
      }
    }

    if (currentUser) {
      if (this.elements.navUserName) this.elements.navUserName.textContent = currentUser.name;
      if (this.elements.navUserRole) this.elements.navUserRole.textContent = currentUser.role;
    }

    document.querySelectorAll('.nav-link').forEach((link) => {
      const route = link.getAttribute('data-route');
      if (route === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    const views = [
      this.elements.viewLogin,
      this.elements.viewRegister,
      this.elements.viewForgotPassword,
      this.elements.viewResetPassword,
      this.elements.viewHome,
      this.elements.viewProducts,
      this.elements.viewProfile,
      this.elements.viewCompany
    ];
    views.forEach((v) => {
      if (v) v.classList.add('hidden');
    });

    switch (currentPath) {
      case '/login':
        if (this.elements.viewLogin) {
          this.elements.viewLogin.classList.remove('hidden');
          if (flashMessage) {
            this.showAlert(this.elements.formAlert, flashMessage, flashMessage.includes('successfully') ? 'success' : 'warning');
          } else {
            this.hideAlert(this.elements.formAlert);
          }
          this.setLoginButtonLoading(false);
        }
        break;

      case '/register':
        if (this.elements.viewRegister) {
          this.elements.viewRegister.classList.remove('hidden');
          if (flashMessage) {
            this.showAlert(this.elements.regFormAlert, flashMessage, 'info');
          } else {
            this.hideAlert(this.elements.regFormAlert);
          }
          this.setRegisterButtonLoading(false);
        }
        break;

      case '/forgot-password':
        if (this.elements.viewForgotPassword) {
          this.elements.viewForgotPassword.classList.remove('hidden');
          if (flashMessage) {
            this.showAlert(this.elements.forgotFormAlert, flashMessage, 'info');
          } else {
            this.hideAlert(this.elements.forgotFormAlert);
          }
          this.setForgotPasswordButtonLoading(false);
          // If login email had input, prefill it
          if (this.elements.forgotEmail && !this.elements.forgotEmail.value && this.elements.emailInput?.value) {
            this.elements.forgotEmail.value = this.elements.emailInput.value;
          }
        }
        break;

      case '/reset-password':
        if (this.elements.viewResetPassword) {
          this.elements.viewResetPassword.classList.remove('hidden');
          const resetEmail = authService.getPendingResetEmail();
          if (resetEmail && this.elements.resetPasswordSubtitle) {
            this.elements.resetPasswordSubtitle.textContent = `Set a new password for ${resetEmail}`;
          }
          if (flashMessage) {
            this.showAlert(this.elements.resetFormAlert, flashMessage, 'info');
          } else {
            this.hideAlert(this.elements.resetFormAlert);
          }
          this.setResetPasswordButtonLoading(false);
        }
        break;

      case '/home':
        if (this.elements.viewHome) {
          this.elements.viewHome.classList.remove('hidden');
          this.renderHomeView(currentUser);
        }
        break;

      case '/products':
        if (this.elements.viewProducts) {
          this.elements.viewProducts.classList.remove('hidden');
          this.renderProductsView();
        }
        break;

      case '/profile':
        if (this.elements.viewProfile) {
          this.elements.viewProfile.classList.remove('hidden');
          this.renderProfileView(currentUser);
        }
        break;

      case '/company':
        if (this.elements.viewCompany) {
          this.elements.viewCompany.classList.remove('hidden');
          this.renderCompanyView();
        }
        break;

      default:
        this.router.navigate('/login');
    }

    window.scrollTo(0, 0);
  }

  renderHomeView(user) {
    const container = document.getElementById('home-content');
    if (!container) return;

    container.innerHTML = `
      <div class="dashboard-hero">
        <div class="dashboard-welcome">
          <div class="badge-pill">Aquaculture Command Center</div>
          <h1 class="dashboard-title">Welcome back, ${user ? user.name : 'Valued Partner'}</h1>
          <p class="dashboard-subtitle">${user ? (user.farmName || "K's ENTERPRISES") : "K's ENTERPRISES"} &bull; Real-time feed monitoring, nutritional benchmarks, and batch dispatch management.</p>
        </div>
        <div class="dashboard-actions">
          <button class="btn btn-secondary" data-route="/products">Browse Feed Catalog</button>
          <button class="btn btn-primary" data-route="/company">About K's ENTERPRISES</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper ocean">
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="stat-data">
            <div class="stat-value">1.18 FCR</div>
            <div class="stat-label">Average Feed Conversion Ratio</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper emerald">
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-data">
            <div class="stat-value">42% - 52%</div>
            <div class="stat-label">Optimal Crude Protein Range</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper teal">
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="stat-data">
            <div class="stat-value">25,000 MT</div>
            <div class="stat-label">Annual Mill Extrusion Volume</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper gold">
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="stat-data">
            <div class="stat-value">HACCP / ISO</div>
            <div class="stat-label">Global Compliance Standard</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card-panel">
          <div class="panel-header">
            <h3>Featured Aquaculture Formulations</h3>
            <button class="link-btn" data-route="/products">View All Products &rarr;</button>
          </div>
          <div class="featured-products-list">
            ${MOCK_DATA.products.slice(0, 2).map((p) => `
              <div class="product-mini-row">
                <div class="product-mini-info">
                  <div class="badge-tag">${p.category}</div>
                  <h4>${p.name}</h4>
                  <p>${p.description}</p>
                </div>
                <div class="product-mini-metrics">
                  <div class="metric-pill">${p.protein}</div>
                  <div class="metric-pill-sub">${p.pelletSize}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card-panel">
          <div class="panel-header">
            <h3>Recent Certified Feed Dispatches</h3>
            <span class="badge-tag green">Real-Time QA</span>
          </div>
          <div class="batches-list">
            ${MOCK_DATA.recentBatches.map((b) => `
              <div class="batch-item">
                <div class="batch-main">
                  <span class="batch-code">${b.batchId}</span>
                  <span class="batch-feed">${b.feedType}</span>
                </div>
                <div class="batch-meta">
                  <span class="batch-qa">${b.status}</span>
                  <span class="batch-protein">${b.proteinTested} Protein</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderProductsView() {
    const container = document.getElementById('products-content');
    if (!container) return;

    container.innerHTML = `
      <div class="section-header">
        <div class="badge-pill">Nutrient-Dense Aquafeed Range</div>
        <h2>Commercial Fish & Shrimp Feed Catalog</h2>
        <p>Formulated with premium marine fish meal, essential fatty acids, and micro-minerals to maximize aquaculture biomass conversion.</p>
      </div>

      <div class="products-grid">
        ${MOCK_DATA.products.map((p) => `
          <div class="product-card">
            <div class="product-card-top">
              <span class="product-badge">${p.badge}</span>
              <span class="product-category">${p.category}</span>
            </div>
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.description}</p>
            
            <div class="product-specs">
              <div class="spec-item">
                <span class="spec-label">Target Species</span>
                <span class="spec-val">${p.targetSpecies}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Nutrient Ratio</span>
                <span class="spec-val">${p.protein} &bull; ${p.fat}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Extrusion Diameter</span>
                <span class="spec-val">${p.pelletSize}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Verified Target FCR</span>
                <span class="spec-val" style="color: var(--color-emerald); font-weight: 700;">${p.fcr}</span>
              </div>
            </div>

            <div class="product-card-footer">
              <button class="btn btn-outline" onclick="window.app.showModal('Product Inquiry: ${p.name}', '<p class=\\'modal-text\\'>To request wholesale batch quotations for <strong>${p.name}</strong>, contact our commercial sales desk at <strong>info@ksenterprises.com</strong> or call <strong>+1 (800) 555-FEED</strong>.</p>')">Request Technical Sheet</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderProfileView(user) {
    const container = document.getElementById('profile-content');
    if (!container) return;

    const token = authService.getAuthToken();
    const session = authService.getSession();

    container.innerHTML = `
      <div class="section-header">
        <div class="badge-pill">Account & Farm Profile</div>
        <h2>Commercial Partner Credentials</h2>
        <p>Manage your aquaculture farm profile, active session security, and access tokens.</p>
      </div>

      <div class="profile-layout">
        <div class="profile-card">
          <div class="profile-header-card">
            <div class="profile-avatar">
              <img src="ceo.jpg" alt="${user ? user.name : 'Alex Morgan'}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%230284C7\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'">
            </div>
            <div class="profile-titles">
              <h3>${user ? user.name : 'Alex Morgan'}</h3>
              <p class="profile-role">${user ? user.role : 'CUSTOMER'}</p>
              <span class="badge-tag green">Verified ${user ? user.role : 'CUSTOMER'} Account</span>
            </div>
          </div>

          <div class="profile-details-list">
            <div class="profile-row">
              <span class="profile-label">Full Name</span>
              <span class="profile-value">${user ? user.name : 'Alex Morgan'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Email Address</span>
              <span class="profile-value">${user ? user.email : 'demo@gmail.com'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Phone Number</span>
              <span class="profile-value">${user ? (user.phone || '+91 9876543210') : '+91 9876543210'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">User Role</span>
              <span class="profile-value">${user ? user.role : 'CUSTOMER'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Associated Enterprise / Farm</span>
              <span class="profile-value">${user ? (user.farmName || 'Blue Ocean Aqua Farms') : 'Blue Ocean Aqua Farms'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Authentication Mode</span>
              <span class="profile-value">${CONFIG.USE_MOCK_AUTH ? 'Prototype Mock Auth Provider' : 'Express REST Backend (/api/auth/login)'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Session Expiry</span>
              <span class="profile-value">${session ? new Date(session.expiresAt).toLocaleString() : 'Active'}</span>
            </div>
          </div>
        </div>

        <div class="profile-card">
          <h3>Security & Session Token</h3>
          <p class="profile-desc" style="margin-top: 0.5rem;">The token below is issued upon successful authentication and verified by route guards.</p>
          
          <div class="token-box">
            <code>${token || 'No active token'}</code>
          </div>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
            <button class="btn btn-secondary" onclick="window.app.handleLogout()">Sign Out of Account</button>
          </div>
        </div>
      </div>
    `;
  }

  renderCompanyView() {
    const container = document.getElementById('company-content');
    if (!container) return;

    container.innerHTML = `
      <div class="company-hero">
        <div class="company-logo-large">
          <img src="K'senterprises.jpg" alt="K's ENTERPRISES Logo">
        </div>
        <div class="badge-pill" style="margin-top: 1rem;">Aquaculture Excellence Since 2018</div>
        <h2 style="font-size: 2rem; color: var(--color-slate-900); margin-top: 0.5rem;">${MOCK_DATA.company.name}</h2>
        <p class="company-lead">${MOCK_DATA.company.tagline}</p>
      </div>

      <div class="company-content-grid">
        <div class="card-panel">
          <h3>About K's ENTERPRISES</h3>
          <p style="color: var(--color-text-body); line-height: 1.7; margin-top: 0.75rem;">${MOCK_DATA.company.about}</p>
          
          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--color-slate-800); margin-bottom: 0.75rem;">Key Operational Metrics</h4>
            <div class="company-stats-grid">
              ${MOCK_DATA.company.stats.map((s) => `
                <div class="stat-mini-card">
                  <div class="stat-mini-val">${s.value}</div>
                  <div class="stat-mini-label">${s.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card-panel">
          <h3>Manufacturing & Contact</h3>
          <div class="contact-info-list" style="margin-top: 1rem;">
            <div class="contact-item">
              <span class="contact-label">Customer & Distributor Support</span>
              <span class="contact-val">${MOCK_DATA.company.contact.email}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Toll-Free Hotline</span>
              <span class="contact-val">${MOCK_DATA.company.contact.phone}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Corporate Headquarters</span>
              <span class="contact-val">${MOCK_DATA.company.contact.headquarters}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Automated Feed Mill</span>
              <span class="contact-val">${MOCK_DATA.company.contact.feedMill}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showModal(title, htmlBody) {
    if (!this.elements.modalContainer) return;
    this.elements.modalTitle.textContent = title;
    this.elements.modalBody.innerHTML = htmlBody;
    this.elements.modalContainer.classList.remove('hidden');
  }

  closeModal() {
    if (!this.elements.modalContainer) return;
    this.elements.modalContainer.classList.add('hidden');
  }

  handlePasswordReset() {
    this.showModal(
      'Reset Link Sent',
      `
        <div style="text-align: center; padding: 1rem 0;">
          <div style="width: 48px; height: 48px; margin: 0 auto 1rem; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center;">
            <svg style="width: 28px; height: 28px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 style="font-size: 1.1rem; color: var(--color-slate-900);">Verification Email Dispatched</h4>
          <p class="modal-text" style="margin-top: 0.5rem;">If an aquaculture account is associated with this email, you will receive password reset instructions shortly.</p>
          <button type="button" class="btn btn-primary" style="margin-top: 1.25rem;" onclick="window.app.closeModal()">Return to Login</button>
        </div>
      `
    );
  }
}

// Bootstrap Application
window.addEventListener('DOMContentLoaded', () => {
  window.app = new FishFeedApp();
  window.app.init();
});

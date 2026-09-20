/**
 * K's ENTERPRISES - Fish Feed Company
 * Main Application Controller
 */

import { CONFIG } from './config.js';
import { validateEmail, validatePassword, validateLoginForm } from './validation.js';
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
    // Auth Views
    this.elements.viewContainer = document.getElementById('app-views');
    this.elements.viewLogin = document.getElementById('view-login');
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
    this.elements.registerLink = document.getElementById('register-link');

    // Modals
    this.elements.modalContainer = document.getElementById('modal-container');
    this.elements.modalTitle = document.getElementById('modal-title');
    this.elements.modalBody = document.getElementById('modal-body');
    this.elements.modalClose = document.getElementById('modal-close');
  }

  setupRouter() {
    this.router = new Router(
      ['/login', '/home', '/products', '/profile', '/company'],
      (currentPath, flashMessage) => this.handleRouteView(currentPath, flashMessage)
    );
  }

  bindEvents() {
    // Form Submit
    if (this.elements.loginForm) {
      this.elements.loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
    }

    // Input Validation on Blur and Input
    if (this.elements.emailInput) {
      this.elements.emailInput.addEventListener('blur', () => this.validateEmailField());
      this.elements.emailInput.addEventListener('input', () => {
        if (this.elements.emailInput.classList.contains('input-invalid')) {
          this.validateEmailField();
        }
      });
    }

    if (this.elements.passwordInput) {
      this.elements.passwordInput.addEventListener('blur', () => this.validatePasswordField());
      this.elements.passwordInput.addEventListener('input', () => {
        if (this.elements.passwordInput.classList.contains('input-invalid')) {
          this.validatePasswordField();
        }
      });
    }

    // Password Visibility Toggle
    if (this.elements.togglePasswordBtn) {
      this.elements.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
    }

    // Demo Fill Shortcut
    if (this.elements.demoFillBtn) {
      this.elements.demoFillBtn.addEventListener('click', () => this.fillDemoCredentials());
    }

    // Navigation Links (Delegated)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.router.navigate(route);
        // Close mobile nav if open
        if (this.elements.navLinksContainer) {
          this.elements.navLinksContainer.classList.remove('active');
        }
      }
    });

    // Logout
    if (this.elements.logoutBtn) {
      this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Mobile Menu Button
    if (this.elements.mobileMenuBtn) {
      this.elements.mobileMenuBtn.addEventListener('click', () => {
        if (this.elements.navLinksContainer) {
          this.elements.navLinksContainer.classList.toggle('active');
        }
      });
    }

    // Forgot Password & Register Modal Triggers
    if (this.elements.forgotPasswordLink) {
      this.elements.forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal(
          'Password Recovery',
          `
            <p class="modal-text">Enter your registered email below to receive a secure password reset link and aquaculture farm verification instructions.</p>
            <div class="form-group" style="margin-top: 1rem;">
              <label class="form-label" for="recovery-email">Registered Email</label>
              <input type="email" id="recovery-email" class="form-control" placeholder="e.g. farm@ksenterprises.com" value="${this.elements.emailInput?.value || ''}">
            </div>
            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="window.app.handlePasswordReset()">Send Reset Instructions</button>
            </div>
          `
        );
      });
    }

    if (this.elements.registerLink) {
      this.elements.registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal(
          'Commercial Client Registration',
          `
            <div style="text-align: center; margin-bottom: 1.25rem;">
              <div class="aqua-badge" style="display: inline-block; margin-bottom: 0.5rem;">K's ENTERPRISES Partnership</div>
              <p class="modal-text">Welcome to K's ENTERPRISES Aquafeed Portal. Wholesale feed distributor & commercial fish farm accounts are provisioned via our onboarding desk.</p>
            </div>
            <div class="demo-card-highlight" style="margin-bottom: 1rem;">
              <div style="font-weight: 600; color: var(--color-primary-dark); font-size: 0.9rem;">To test the platform right now:</div>
              <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">Use our pre-configured Demo Account on the login screen (<code>demo@gmail.com</code> / <code>Demo@123</code>).</div>
            </div>
            <div style="text-align: right;">
              <button type="button" class="btn btn-primary" onclick="window.app.closeModal(); window.app.fillDemoCredentials();">Fill Demo Account & Test</button>
            </div>
          `
        );
      });
    }

    // Modal Close Button & Backdrop
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

    // Close modal on Escape
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

  validateEmailField() {
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

  validatePasswordField() {
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

  showFieldError(inputEl, errorEl, message) {
    inputEl.classList.add('input-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  clearFieldError(inputEl, errorEl) {
    inputEl.classList.remove('input-invalid');
    inputEl.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  clearAllErrors() {
    this.clearFieldError(this.elements.emailInput, this.elements.emailError);
    this.clearFieldError(this.elements.passwordInput, this.elements.passwordError);
    this.hideAlert();
  }

  showAlert(message, type = 'error') {
    if (!this.elements.formAlert) return;
    this.elements.formAlert.textContent = message;
    this.elements.formAlert.className = `form-alert alert-${type}`;
    this.elements.formAlert.classList.remove('hidden');
    this.elements.formAlert.setAttribute('role', 'alert');
  }

  hideAlert() {
    if (!this.elements.formAlert) return;
    this.elements.formAlert.textContent = '';
    this.elements.formAlert.className = 'form-alert hidden';
  }

  togglePasswordVisibility() {
    const input = this.elements.passwordInput;
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    
    // Update button ARIA and SVG icon
    this.elements.togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    this.elements.togglePasswordBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');

    if (this.elements.togglePasswordIcon) {
      if (isPassword) {
        // Eye-off icon (open eye / strikethrough or visible state)
        this.elements.togglePasswordIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        `;
      } else {
        // Eye icon (standard view)
        this.elements.togglePasswordIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      }
    }
  }

  fillDemoCredentials() {
    this.elements.emailInput.value = CONFIG.DEMO_CREDENTIALS.email;
    this.elements.passwordInput.value = CONFIG.DEMO_CREDENTIALS.password;
    this.clearAllErrors();
    
    // Provide visual subtle highlight on fields
    this.elements.emailInput.classList.add('input-highlight');
    this.elements.passwordInput.classList.add('input-highlight');
    setTimeout(() => {
      this.elements.emailInput.classList.remove('input-highlight');
      this.elements.passwordInput.classList.remove('input-highlight');
    }, 800);

    this.showAlert('Demo credentials populated. Click "Sign In" to enter.', 'info');
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    this.clearAllErrors();

    const email = this.elements.emailInput.value;
    const password = this.elements.passwordInput.value;
    const rememberMe = this.elements.rememberMe ? this.elements.rememberMe.checked : false;

    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      if (validation.errors.email) {
        this.showFieldError(this.elements.emailInput, this.elements.emailError, validation.errors.email);
      }
      if (validation.errors.password) {
        this.showFieldError(this.elements.passwordInput, this.elements.passwordError, validation.errors.password);
      }

      // Focus first error field for accessibility
      if (validation.errors.email) {
        this.elements.emailInput.focus();
      } else if (validation.errors.password) {
        this.elements.passwordInput.focus();
      }
      return;
    }

    // Set Loading State
    this.setButtonLoading(true);

    try {
      const result = await authService.login(email, password, rememberMe);

      if (result.success) {
        this.showAlert('Authentication successful! Redirecting to aquaculture portal...', 'success');
        this.elements.loginBtnText.textContent = 'Welcome Back!';

        setTimeout(() => {
          this.setButtonLoading(false);
          this.router.navigate('/home');
        }, 500);
      } else {
        this.setButtonLoading(false);
        this.showAlert(result.message || 'Invalid login credentials', 'error');
        this.showFieldError(this.elements.passwordInput, this.elements.passwordError, 'Invalid login credentials');
        this.elements.passwordInput.focus();
      }
    } catch (err) {
      this.setButtonLoading(false);
      console.error('Login error:', err);
      this.showAlert('An unexpected error occurred during login. Please try again.', 'error');
    }
  }

  setButtonLoading(isLoading) {
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

  handleLogout() {
    authService.logout();
    this.router.navigate('/login', 'You have been securely logged out.');
  }

  handleRouteView(currentPath, flashMessage) {
    const isAuth = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Toggle Main Nav visibility
    if (this.elements.mainNav) {
      if (currentPath === '/login') {
        this.elements.mainNav.classList.add('hidden');
      } else {
        this.elements.mainNav.classList.remove('hidden');
      }
    }

    // Update Nav User Badge if logged in
    if (currentUser) {
      if (this.elements.navUserName) this.elements.navUserName.textContent = currentUser.name;
      if (this.elements.navUserRole) this.elements.navUserRole.textContent = currentUser.role;
    }

    // Update active nav links
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

    // Hide all view containers
    const views = [
      this.elements.viewLogin,
      this.elements.viewHome,
      this.elements.viewProducts,
      this.elements.viewProfile,
      this.elements.viewCompany
    ];
    views.forEach((v) => {
      if (v) v.classList.add('hidden');
    });

    // Render target view
    switch (currentPath) {
      case '/login':
        if (this.elements.viewLogin) {
          this.elements.viewLogin.classList.remove('hidden');
          if (flashMessage) {
            this.showAlert(flashMessage, 'warning');
          } else {
            this.hideAlert();
          }
          this.setButtonLoading(false);
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

    // Scroll to top
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
          <p class="dashboard-subtitle">${user ? user.farmName : "K's ENTERPRISES"} &bull; Real-time feed monitoring, nutritional benchmarks, and batch dispatch management.</p>
        </div>
        <div class="dashboard-actions">
          <button class="btn btn-secondary" data-route="/products">Browse Feed Catalog</button>
          <button class="btn btn-primary" data-route="/company">About K's ENTERPRISES</button>
        </div>
      </div>

      <!-- Overview Stats Grid -->
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

      <!-- Feed Nutrition & Highlights -->
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
              <p class="profile-role">${user ? user.role : 'Aquaculture Farm Manager'}</p>
              <span class="badge-tag green">Verified Commercial Account</span>
            </div>
          </div>

          <div class="profile-details-list">
            <div class="profile-row">
              <span class="profile-label">Email Address</span>
              <span class="profile-value">${user ? user.email : 'demo@gmail.com'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Associated Enterprise / Farm</span>
              <span class="profile-value">${user ? user.farmName : 'Blue Ocean Aqua Farms'}</span>
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

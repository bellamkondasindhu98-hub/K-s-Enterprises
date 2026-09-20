/**
 * K's ENTERPRISES - Fish Feed Company
 * Client-Side Router with Authentication Guard
 */

import { authService } from './authService.js';

export class Router {
  constructor(routes, onNavigate) {
    this.routes = routes;
    this.onNavigate = onNavigate;
    this.protectedRoutes = new Set(['/home', '/products', '/profile', '/company']);
    this.currentPath = '/login';
    this.flashMessage = null;

    // Listen to browser back/forward and hash changes
    window.addEventListener('popstate', () => this.handleLocationChange());
    window.addEventListener('hashchange', () => this.handleLocationChange());
  }

  /**
   * Initializes the router based on the initial URL
   */
  init() {
    this.handleLocationChange();
  }

  /**
   * Extracts clean normalized path from current window location
   * Supports both path (/home) and hash (#home or #/home or #register)
   */
  getCurrentPath() {
    // Check hash first if present (e.g. #/home or #home or #register)
    const hash = window.location.hash.replace(/^#\/?/, '/');
    if (hash && hash !== '/') {
      return hash.startsWith('/') ? hash : '/' + hash;
    }

    // Otherwise check pathname
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/' && pathname !== '/index.html') {
      return pathname.startsWith('/') ? pathname : '/' + pathname;
    }

    return '/login';
  }

  /**
   * Navigate to a destination route
   * @param {string} rawPath 
   * @param {string|null} flash 
   */
  navigate(rawPath, flash = null) {
    let path = rawPath.startsWith('/') ? rawPath : '/' + rawPath;

    // Route Guarding: Protect private pages
    if (this.protectedRoutes.has(path) && !authService.isAuthenticated()) {
      this.flashMessage = flash || 'Authentication required. Please log in to access this page.';
      path = '/login';
    } else if ((path === '/login' || path === '/register') && authService.isAuthenticated()) {
      // If already logged in and visiting auth pages, redirect to home
      path = '/home';
    }

    this.currentPath = path;
    if (flash && (path === '/login' || path === '/register')) {
      this.flashMessage = flash;
    }

    // Update URL without page reload
    const targetHash = '#' + path;
    if (window.location.hash !== targetHash) {
      window.history.pushState({ path }, '', targetHash);
    }

    if (typeof this.onNavigate === 'function') {
      this.onNavigate(this.currentPath, this.flashMessage);
    }
    
    // Clear flash message after consumption
    this.flashMessage = null;
  }

  /**
   * Handles browser location change (back, forward, bookmark)
   */
  handleLocationChange() {
    const detectedPath = this.getCurrentPath();
    this.navigate(detectedPath, this.flashMessage);
  }

  /**
   * Sets a flash message to display on the next view
   */
  setFlash(msg) {
    this.flashMessage = msg;
  }
}

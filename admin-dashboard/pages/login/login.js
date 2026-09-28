/**
 * Admin Login Page Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admin-login-form');
  const errorMsg = document.getElementById('admin-login-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';

      const email = document.getElementById('admin-email').value.trim();
      const password = document.getElementById('admin-password').value;

      try {
        const res = await adminAuthService.login(email, password);
        if (res.success) {
          window.location.href = '../dashboard/index.html';
        }
      } catch (err) {
        errorMsg.textContent = err.message || 'Invalid administrator credentials.';
        errorMsg.style.display = 'block';
      }
    });
  }
});

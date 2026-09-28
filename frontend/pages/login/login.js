/**
 * Login Page Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const googleBtn = document.getElementById('google-login-btn');
  const errorMsg = document.getElementById('login-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await authService.login(email, password);
        if (res.success) {
          window.location.href = '../home/index.html';
        }
      } catch (err) {
        errorMsg.textContent = err.message || 'Login failed. Please check your credentials.';
        errorMsg.style.display = 'block';
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      // Mock Google Auth selector or initiate OAuth client
      try {
        const mockGoogleUser = {
          googleId: 'g_' + Math.random().toString(36).substr(2, 9),
          email: 'google.user@example.com',
          name: 'Google Customer User',
          avatarUrl: ''
        };
        const res = await authService.googleAuth(
          mockGoogleUser.googleId,
          mockGoogleUser.email,
          mockGoogleUser.name,
          mockGoogleUser.avatarUrl
        );
        if (res.success) {
          window.location.href = '../home/index.html';
        }
      } catch (err) {
        errorMsg.textContent = err.message || 'Google sign-in failed.';
        errorMsg.style.display = 'block';
      }
    });
  }
});

/**
 * Register Page Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const googleBtn = document.getElementById('google-signup-btn');
  const errorMsg = document.getElementById('register-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match.';
        errorMsg.style.display = 'block';
        return;
      }

      try {
        const res = await authService.register(name, email, phone, password, confirmPassword);
        if (res.success) {
          window.location.href = '../home/index.html';
        }
      } catch (err) {
        errorMsg.textContent = err.message || 'Registration failed. Please try again.';
        errorMsg.style.display = 'block';
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const mockGoogleUser = {
          googleId: 'g_' + Math.random().toString(36).substr(2, 9),
          email: 'google.newuser@example.com',
          name: 'Google Registered Farmer',
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
        errorMsg.textContent = err.message || 'Google sign-up failed.';
        errorMsg.style.display = 'block';
      }
    });
  }
});

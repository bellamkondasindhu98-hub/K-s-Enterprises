/**
 * Reset Password Page Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reset-form');
  const messageBox = document.getElementById('message-box');
  const errorMsg = document.getElementById('reset-error');

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    errorMsg.textContent = 'Invalid or missing password reset token. Please request a new link.';
    errorMsg.style.display = 'block';
    if (form) form.style.display = 'none';
    return;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';
      messageBox.style.display = 'none';

      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (newPassword !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match.';
        errorMsg.style.display = 'block';
        return;
      }

      try {
        await authService.resetPassword(token, newPassword, confirmPassword);
        messageBox.textContent = 'Password reset successfully! Redirecting to login...';
        messageBox.style.display = 'block';
        setTimeout(() => {
          window.location.href = '../login/index.html';
        }, 2000);
      } catch (err) {
        errorMsg.textContent = err.message || 'Failed to reset password. The link may have expired.';
        errorMsg.style.display = 'block';
      }
    });
  }
});

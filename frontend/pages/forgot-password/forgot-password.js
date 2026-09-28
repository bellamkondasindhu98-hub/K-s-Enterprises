/**
 * Forgot Password Page Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgot-form');
  const messageBox = document.getElementById('message-box');
  const errorMsg = document.getElementById('forgot-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';
      messageBox.style.display = 'none';

      const email = document.getElementById('email').value.trim();

      try {
        await authService.forgotPassword(email);
        messageBox.textContent = `If ${email} is registered with us, a password reset link has been dispatched.`;
        messageBox.style.display = 'block';
        form.reset();
      } catch (err) {
        errorMsg.textContent = err.message || 'Unable to process password reset request.';
        errorMsg.style.display = 'block';
      }
    });
  }
});

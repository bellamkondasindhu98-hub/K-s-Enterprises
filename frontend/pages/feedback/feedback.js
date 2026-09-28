/**
 * Feedback Page Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  const msgBox = document.getElementById('feedback-success-msg');
  const errorBox = document.getElementById('feedback-error-msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msgBox.style.display = 'none';
      errorBox.style.display = 'none';

      const name = document.getElementById('fb-name').value.trim();
      const email = document.getElementById('fb-email').value.trim();
      const phone = document.getElementById('fb-phone').value.trim();
      const message = document.getElementById('fb-message').value.trim();

      try {
        await reviewService.submitGeneralFeedback(name, email, phone, message);
        msgBox.textContent = 'Thank you for your valuable feedback! Our team will review your comments.';
        msgBox.style.display = 'block';
        form.reset();
      } catch (err) {
        errorBox.textContent = err.message || 'Feedback submission failed. Please try again.';
        errorBox.style.display = 'block';
      }
    });
  }
});

/**
 * K's Enterprises - WhatsApp Order Button Component
 */
function renderWhatsAppOrderButton(containerId, product) {
  const container = document.getElementById(containerId);
  if (!container || !product) return;

  const isAvailable = product.availability === 'AVAILABLE';

  container.innerHTML = `
    <div class="whatsapp-order-container">
      ${isAvailable ? `
        <button 
          class="btn-whatsapp-large" 
          onclick="handleWhatsAppOrderDirect(${product.id})"
        >
          <span style="font-size: 1.4rem;">💬</span>
          <span data-i18n="whatsapp.buttonText">ORDER THROUGH WHATSAPP</span>
        </button>
        <p class="whatsapp-note">Orders are processed directly via WhatsApp chat with K's Enterprises.</p>
      ` : `
        <button 
          class="btn-whatsapp-large disabled" 
          disabled
        >
          <span style="font-size: 1.4rem;">🚫</span>
          <span>OUT OF STOCK - ORDER UNAVAILABLE</span>
        </button>
        <p class="whatsapp-note" style="color: var(--danger-color);">This item is currently out of stock and cannot be ordered.</p>
      `}
    </div>
  `;
}

async function handleWhatsAppOrderDirect(productId) {
  try {
    const res = await productService.getProductById(productId);
    if (res.success && res.data) {
      whatsappService.openOrderChat(res.data);
    }
  } catch (e) {
    console.error('Failed to launch WhatsApp order:', e);
  }
}

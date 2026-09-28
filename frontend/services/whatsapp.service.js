/**
 * K's Enterprises - WhatsApp Order System Service
 * Centralized WhatsApp order message builder & launcher
 */
class WhatsAppService {
  constructor() {
    // Configurable fallback number placeholder
    this.defaultNumber = '+91XXXXXXXXXX'; 
    this.cachedNumber = null;
  }

  async getCompanyWhatsAppNumber() {
    if (this.cachedNumber) return this.cachedNumber;
    try {
      const res = await companyService.getCompanyProfile();
      if (res.success && res.data?.whatsappNumber && !res.data.whatsappNumber.includes('PLACEHOLDER')) {
        this.cachedNumber = res.data.whatsappNumber;
        return this.cachedNumber;
      }
    } catch (e) {
      console.debug('Using default WhatsApp number placeholder');
    }
    return this.defaultNumber;
  }

  async generateOrderUrl(product) {
    if (!product || product.availability === 'OUT_OF_STOCK') {
      return null;
    }

    const number = await this.getCompanyWhatsAppNumber();
    const cleanNumber = number.replace(/[^0-9]/g, '');

    const message = `Hello K's Enterprises,\n\nI am interested in this product:\n\nProduct: ${product.name}\nPrice: ₹${product.price}\nPackage: ${product.packageSize || 'Standard'}\n\nI would like to place an order.\n\nThank you.`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  }

  async openOrderChat(product) {
    const url = await this.generateOrderUrl(product);
    if (!url) {
      alert('This product is currently OUT OF STOCK and unavailable for WhatsApp order.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async openGeneralInquiryChat(inquiryTopic = 'General Aquaculture Inquiry') {
    const number = await this.getCompanyWhatsAppNumber();
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const message = `Hello K's Enterprises,\n\nI have an inquiry regarding: ${inquiryTopic}.\n\nPlease provide more information.\n\nThank you.`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const whatsappService = new WhatsAppService();
if (typeof window !== 'undefined') {
  window.whatsappService = whatsappService;
}

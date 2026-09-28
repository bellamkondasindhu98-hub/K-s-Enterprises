/**
 * K's Enterprises - Company & Website Content Service
 */
class CompanyService {
  async getCompanyProfile() {
    return await apiService.get('/company/profile');
  }

  async getCeoProfile() {
    return await apiService.get('/company/ceo');
  }

  async getWebsiteContent(sectionKey) {
    return await apiService.get(`/company/content/${sectionKey}`);
  }
}

const companyService = new CompanyService();
if (typeof window !== 'undefined') {
  window.companyService = companyService;
}

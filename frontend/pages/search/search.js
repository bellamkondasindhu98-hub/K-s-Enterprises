/**
 * Search Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';

  renderSearchBar('search-bar-header-box', initialQuery);
  if (initialQuery) {
    await executeSearch(initialQuery);
  } else {
    document.getElementById('search-results-count').textContent = 'Enter keywords above to search feeds';
  }
});

async function executeSearch(query) {
  const countEl = document.getElementById('search-results-count');
  const catSection = document.getElementById('matched-categories-section');
  const catContainer = document.getElementById('matched-categories-box');

  countEl.textContent = `Searching for "${query}"...`;

  try {
    const res = await productService.searchProducts(query);
    if (res.success && res.data) {
      const data = res.data;
      countEl.innerHTML = `Found <strong>${data.totalResults}</strong> feed products for "<em>${escapeHtml(query)}</em>"`;

      if (data.categories && data.categories.length > 0) {
        catSection.style.display = 'block';
        catContainer.innerHTML = data.categories.map(c => `
          <a href="../products/index.html?category=${c.id}" class="badge badge-in-stock" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
            📁 ${c.name} (${c.productCount})
          </a>
        `).join(' ');
      } else {
        catSection.style.display = 'none';
      }

      renderProductGrid(data.products, 'search-results-grid', '../../');
    }
  } catch (e) {
    countEl.textContent = `Results for "${query}":`;
    renderProductGrid([], 'search-results-grid', '../../');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

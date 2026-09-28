/**
 * K's Enterprises - Product Grid Component
 */
function renderProductGrid(products, containerId, rootPath = './') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="product-grid-empty">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🐟</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">No Products Found</h3>
        <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 1.5rem;">There are currently no products matching the selected criteria.</p>
        <a href="${rootPath}pages/products/index.html" class="btn btn-outline">View All Products</a>
      </div>
    `;
    return;
  }

  const gridHtml = `
    <div class="product-grid">
      ${products.map(p => createProductCardHtml(p, rootPath)).join('')}
    </div>
  `;

  container.innerHTML = gridHtml;
}

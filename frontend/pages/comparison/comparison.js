/**
 * Product Comparison Page Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const baseId = urlParams.get('baseId') || '1';

  await populateBaseProductSelector(baseId);
  await loadComparisonMatrix(baseId);
});

async function populateBaseProductSelector(selectedId) {
  const selectEl = document.getElementById('base-product-select');
  if (!selectEl) return;

  try {
    const res = await productService.getAllProducts();
    if (res.success && res.data) {
      selectEl.innerHTML = res.data.map(p => `
        <option value="${p.id}" ${p.id == selectedId ? 'selected' : ''}>${p.name}</option>
      `).join('');
    }
  } catch (e) {
    selectEl.innerHTML = `<option value="1">AquaGrow Floating Feed 28%</option><option value="2">AquaGrow Floating Feed 32%</option>`;
  }

  selectEl.addEventListener('change', (e) => {
    loadComparisonMatrix(e.target.value);
  });
}

async function loadComparisonMatrix(baseProductId) {
  const container = document.getElementById('comparison-matrix-container');
  container.innerHTML = '<p class="text-center">Loading comparison data...</p>';

  try {
    const res = await comparisonService.getComparisonMatrix(baseProductId);
    if (res.success && res.data) {
      renderMatrix(res.data);
    }
  } catch (e) {
    // Fallback data
    renderMatrix({
      ksProduct: {
        id: 1,
        name: "AquaGrow Floating Feed 28%",
        price: 1650,
        feedType: "Floating Pellets",
        packageSize: "40 kg Bag",
        suitableFish: "Tilapia, Pangasius, Rohu, Catla",
        availability: "AVAILABLE",
        specifications: "Crude Protein: 28%, Fat: 5.0%, Fiber: 5.5%"
      },
      competitors: [
        {
          id: 1,
          competitorName: "Company B Commercial Feed",
          price: 1720,
          proteinContent: "26%",
          packageSize: "40 kg",
          fishType: "Tilapia, Pangasius",
          feedType: "Floating Pellets",
          availability: "Available",
          nutritionalDetails: "Crude Protein: 26%, Fat: 4.0%, Fiber: 6.5%"
        },
        {
          id: 2,
          competitorName: "Company C AgroFeed",
          price: 1690,
          proteinContent: "25%",
          packageSize: "40 kg",
          fishType: "General Aquaculture",
          feedType: "Floating Pellets",
          availability: "Out of Stock",
          nutritionalDetails: "Crude Protein: 25%, Fat: 3.8%, Fiber: 7.0%"
        }
      ]
    });
  }
}

function renderMatrix(data) {
  const ks = data.ksProduct;
  const comps = data.competitors || [];
  const container = document.getElementById('comparison-matrix-container');

  if (!comps.length) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 3rem;">
        <h3>No Competitor Benchmarks Configured</h3>
        <p class="text-muted">Administrator has not yet added comparison data for this feed.</p>
      </div>
    `;
    return;
  }

  let tableHtml = `
    <div class="comparison-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th class="factor-col" data-i18n="comparison.factor">Comparison Factor</th>
            <th class="ks-col">${ks.name} (K's Enterprises)</th>
            ${comps.map(c => `<th>${c.competitorName}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th class="factor-col" data-i18n="products.price">Price</th>
            <td class="ks-cell"><strong>₹${Number(ks.price).toLocaleString('en-IN')}</strong></td>
            ${comps.map(c => `<td>₹${Number(c.price).toLocaleString('en-IN')}</td>`).join('')}
          </tr>
          <tr>
            <th class="factor-col" data-i18n="comparison.protein">Protein Content</th>
            <td class="ks-cell">28% - 32% (Lab Tested)</td>
            ${comps.map(c => `<td>${c.proteinContent}</td>`).join('')}
          </tr>
          <tr>
            <th class="factor-col" data-i18n="comparison.package">Package Size</th>
            <td class="ks-cell">${ks.packageSize || '40 kg Bag'}</td>
            ${comps.map(c => `<td>${c.packageSize}</td>`).join('')}
          </tr>
          <tr>
            <th class="factor-col" data-i18n="comparison.fishType">Suitable Fish</th>
            <td class="ks-cell">${ks.suitableFish || 'Freshwater Species'}</td>
            ${comps.map(c => `<td>${c.fishType}</td>`).join('')}
          </tr>
          <tr>
            <th class="factor-col" data-i18n="products.feedType">Feed Type</th>
            <td class="ks-cell">${ks.feedType || 'Floating Pellets'}</td>
            ${comps.map(c => `<td>${c.feedType}</td>`).join('')}
          </tr>
          <tr>
            <th class="factor-col" data-i18n="comparison.availability">Availability</th>
            <td class="ks-cell">
              <span class="badge ${ks.availability === 'AVAILABLE' ? 'badge-in-stock' : 'badge-out-of-stock'}">
                ${ks.availability}
              </span>
            </td>
            ${comps.map(c => `
              <td>
                <span class="badge ${c.availability.toLowerCase().includes('out') ? 'badge-out-of-stock' : 'badge-in-stock'}">
                  ${c.availability}
                </span>
              </td>
            `).join('')}
          </tr>
          <tr>
            <th class="factor-col">Nutritional Details</th>
            <td class="ks-cell">${ks.description || 'Optimal FCR, fortified amino acids'}</td>
            ${comps.map(c => `<td>${c.nutritionalDetails || '-'}</td>`).join('')}
          </tr>
          <tr>
            <th class="factor-col">Direct Action</th>
            <td class="ks-cell">
              <button class="btn btn-whatsapp" style="width: 100%;" onclick="orderProductViaWhatsApp(${ks.id})">
                💬 Order via WhatsApp
              </button>
            </td>
            ${comps.map(() => `<td><span class="text-muted">Market Reference</span></td>`).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
}

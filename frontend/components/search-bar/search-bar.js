/**
 * K's Enterprises - Reusable Search Bar Component
 */
function renderSearchBar(containerId, initialQuery = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isSubpage = window.location.pathname.includes('/pages/');
  const rootPath = isSubpage ? '../../' : './';

  container.innerHTML = `
    <div class="search-bar-container">
      <form onsubmit="handleGlobalSearch(event, '${rootPath}')" class="search-input-wrapper">
        <input 
          type="text" 
          id="global-search-input" 
          class="search-input" 
          placeholder="Search by feed name, category, or fish species (e.g. Tilapia, Floating)..."
          value="${initialQuery}"
          data-i18n="search.placeholder"
        />
        <button type="submit" class="search-submit-btn" aria-label="Search">
          🔍
        </button>
      </form>
    </div>
  `;
}

function handleGlobalSearch(event, rootPath = './') {
  event.preventDefault();
  const input = document.getElementById('global-search-input');
  if (!input) return;
  const q = encodeURIComponent(input.value.trim());
  window.location.href = `${rootPath}pages/search/index.html?q=${q}`;
}

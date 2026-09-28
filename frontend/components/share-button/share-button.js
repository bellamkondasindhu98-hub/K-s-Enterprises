/**
 * K's Enterprises - Share Button Component
 */
function renderShareButton(containerId, productName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <button class="btn-share" onclick="handleProductShare('${encodeURIComponent(productName)}')">
      <span>🔗</span>
      <span>Share Product</span>
    </button>
  `;
}

function handleProductShare(encodedName) {
  const url = window.location.href;
  const name = decodeURIComponent(encodedName);
  if (navigator.share) {
    navigator.share({
      title: `${name} | K's Enterprises`,
      text: `Discover ${name} by K's Enterprises:`,
      url: url
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert(`Link copied to clipboard:\n${url}`);
    });
  }
}

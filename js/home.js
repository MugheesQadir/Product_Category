const featuredGrid = document.getElementById('featuredGrid');
const featuredCodes = ['01A', '01G', '07A', '31D'];

if (featuredGrid) {
  fetch('data/products.json')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load products');
      return response.json();
    })
    .then(products => {
      featuredGrid.innerHTML = '';

      featuredCodes.forEach((code, index) => {
        const product = products.find(item => item.code === code);
        if (!product) return;

        featuredGrid.innerHTML += `
          <a class="card reveal" href="product.html?code=${product.code}" aria-label="View ${product.name}" style="transition-delay:${(index + 1) * 80}ms">
            <div class="card-image">
              <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'">
            </div>
            <div class="card-body">
              <h3>${product.name}</h3>
              <p>${product.type} | ${product.size}</p>
              <div class="card-meta">
                <span>${product.colour}</span>
                <span>View</span>
              </div>
            </div>
          </a>
        `;
      });

      if (!featuredGrid.innerHTML.trim()) {
        featuredGrid.innerHTML = '<div class="empty-state">Featured products are temporarily unavailable.</div>';
      } else {
        initRevealAnimations();
      }
    })
    .catch(() => {
      featuredGrid.innerHTML = '<div class="empty-state">Featured products are temporarily unavailable.</div>';
    });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => {
    observer.observe(item);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRevealAnimations);
} else {
  initRevealAnimations();
}
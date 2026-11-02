const grid = document.getElementById('productGrid');
const searchBox = document.getElementById('searchBox');
const typeFilter = document.getElementById('typeFilter');
const colourFilter = document.getElementById('colourFilter');
const resultCount = document.getElementById('resultCount');

if (grid && searchBox && typeFilter && colourFilter && resultCount) {
  let allProducts = [];

  function fillDropdown(select, field) {
    const values = [...new Set(allProducts.map(product => product[field]).filter(Boolean))].sort();
    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function showProducts() {
    const text = searchBox.value.trim().toLowerCase();
    const type = typeFilter.value;
    const colour = colourFilter.value;

    const result = allProducts.filter(product => {
      const matchesText = product.name.toLowerCase().includes(text);
      const matchesType = type === '' || product.type === type;
      const matchesColour = colour === '' || product.colour === colour;
      return matchesText && matchesType && matchesColour;
    });

    grid.innerHTML = '';

    if (!result.length) {
      grid.innerHTML = '<div class="empty-state">No panels match your filters. Try another colour or search term.</div>';
      resultCount.textContent = '0 products found';
      return;
    }

    result.forEach(product => {
      const card = document.createElement('a');
      card.href = `product.html?code=${product.code}`;
      card.className = 'card reveal';
      card.innerHTML = `
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
      `;
      grid.appendChild(card);
    });

    resultCount.textContent = `${result.length} product${result.length === 1 ? '' : 's'} found`;
    initRevealAnimations();
  }

  fetch('data/products.json')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load products');
      return response.json();
    })
    .then(products => {
      allProducts = products;
      fillDropdown(typeFilter, 'type');
      fillDropdown(colourFilter, 'colour');

      const urlType = new URLSearchParams(window.location.search).get('type');
      if (urlType) {
        typeFilter.value = urlType;
      }

      showProducts();
    })
    .catch(() => {
      grid.innerHTML = '<div class="empty-state">The collection is temporarily unavailable. Please try again soon.</div>';
      resultCount.textContent = '0 products found';
    });

  searchBox.addEventListener('input', showProducts);
  typeFilter.addEventListener('change', showProducts);
  colourFilter.addEventListener('change', showProducts);
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
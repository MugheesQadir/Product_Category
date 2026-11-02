const box = document.getElementById('detailBox');

if (box) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  fetch('data/products.json')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load product data');
      return response.json();
    })
    .then(products => {
      const product = products.find(item => item.code === code);

      if (!product) {
        box.innerHTML = '<div class="empty-state">Product not found. Please return to the collection and choose another panel.</div>';
        return;
      }

      box.innerHTML = `
        <div class="detail-image-wrap">
          <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
        </div>
        <div class="detail-info">
          <p class="eyebrow" style="margin-bottom:16px; display:inline-flex; background:rgba(17,17,17,0.04); color:#111; border:1px solid rgba(17,17,17,0.06);">${product.type}</p>
          <h1>${product.name}</h1>
          <p>${product.colour} finish with an elevated, architect-led aesthetic for contemporary interiors.</p>
          <div class="detail-list">
            <p><strong>Code:</strong> ${product.code}</p>
            <p><strong>Colour:</strong> ${product.colour}</p>
            <p><strong>Size:</strong> ${product.size}</p>
            <p><strong>Pieces per pack:</strong> ${product.piecesPerPack}</p>
          </div>
          <a href="contact.html" class="btn">Enquire Now</a>
        </div>
      `;
    })
    .catch(() => {
      box.innerHTML = '<div class="empty-state">This product is temporarily unavailable. Please contact our team for assistance.</div>';
    });
}
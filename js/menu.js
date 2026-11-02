const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');

if (menu) {
  const links = [
    { label: 'Home', href: 'index.html' },
    { label: 'Wall Panels', href: 'panels.html' },
    { label: 'Contact', href: 'contact.html' }
  ];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  menu.innerHTML = links.map(({ label, href }) => {
    const isActive = currentPage === href ? 'active' : '';
    return `<a href="${href}" class="${isActive}">${label}</a>`;
  }).join('');

  menu.classList.add('nav-links');
}

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}
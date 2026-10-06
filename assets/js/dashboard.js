/**
 * Stackly Hospital ERP & Patient Portal
 * Mobile Sidebar Drawer & Responsive Table Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const brand = document.querySelector('.top-hdr .brand');
  const sidebar = document.querySelector('.sidebar');

  if (brand && sidebar) {
    // 1. Create or ensure mobile menu toggle button exists
    let menuBtn = document.querySelector('.dash-menu-toggle');
    if (!menuBtn) {
      menuBtn = document.createElement('button');
      menuBtn.className = 'dash-menu-toggle';
      menuBtn.setAttribute('aria-label', 'Toggle Dashboard Menu');
      menuBtn.innerHTML = '<i class="fa fa-bars"></i>';
      brand.insertBefore(menuBtn, brand.firstChild);
    }

    // 2. Create or ensure backdrop exists
    let backdrop = document.querySelector('.dash-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'dash-backdrop';
      document.body.appendChild(backdrop);
    }

    // 3. Add Drawer Header with Stackly Logo and Close Button on mobile
    let drawerHeader = sidebar.querySelector('.sidebar-drawer-header');
    if (!drawerHeader) {
      // Remove any previously inserted loose close button
      const looseClose = sidebar.querySelector(':scope > .sidebar-close-btn');
      if (looseClose) looseClose.remove();

      drawerHeader = document.createElement('div');
      drawerHeader.className = 'sidebar-drawer-header';

      const topBrand = document.querySelector('.top-hdr .brand a.brand-name, .top-hdr a.brand-name');
      const homeHref = topBrand ? (topBrand.getAttribute('href') || 'dashboard-user.html') : 'dashboard-user.html';

      drawerHeader.innerHTML = `
        <a href="${homeHref}" class="sidebar-brand-logo" aria-label="Stackly Health">
          <img src="assets/images/stackly-logo.png" alt="Stackly Health">
        </a>
        <button class="sidebar-close-btn" aria-label="Close Menu">
          <i class="fa fa-xmark"></i>
        </button>
      `;

      sidebar.insertBefore(drawerHeader, sidebar.firstChild);
      const closeBtn = drawerHeader.querySelector('.sidebar-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    }

    function openSidebar() {
      sidebar.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    backdrop.addEventListener('click', closeSidebar);

    // Close sidebar when clicking any navigation link
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  // 4. Wrap any raw tables in responsive containers with swipe hint
  document.querySelectorAll('.sec > table, .card > table').forEach(table => {
    if (!table.parentElement.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      wrapper.scrollLeft = 0;
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);

      const hint = document.createElement('div');
      hint.className = 'dash-table-hint';
      hint.innerHTML = '<i class="fa fa-arrows-left-right"></i> Scroll table horizontally';
      wrapper.parentNode.insertBefore(hint, wrapper);
    }
  });
});

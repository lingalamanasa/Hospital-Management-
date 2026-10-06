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

    // 3. Add Close Button at the top of the sidebar on mobile if not present
    if (!sidebar.querySelector('.sidebar-close-btn')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'sidebar-close-btn';
      closeBtn.setAttribute('aria-label', 'Close Menu');
      closeBtn.innerHTML = '<i class="fa fa-xmark"></i>';
      sidebar.insertBefore(closeBtn, sidebar.firstChild);
      closeBtn.addEventListener('click', closeSidebar);
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

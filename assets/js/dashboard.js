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

  // 4. Transform table sections into Image 2 style card list on mobile
  document.querySelectorAll('.sec > table, .card > table, .table-responsive > table').forEach(table => {
    // Avoid double generation
    const parentContainer = table.closest('.table-responsive') || table;
    const parentSec = parentContainer.parentElement;
    if (parentSec && parentSec.querySelector('.dash-cards-container')) {
      return;
    }

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (!headers.length || !rows.length) return;

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'dash-cards-container';

    rows.forEach((tr, idx) => {
      const cells = Array.from(tr.querySelectorAll('td'));
      if (!cells.length) return;

      const card = document.createElement('div');
      card.className = 'dash-card';

      // 1. Determine what is Header ID vs Title
      let idLabel = headers[0] || 'RECORD ID';
      let idValue = cells[0] ? cells[0].textContent.trim() : ('#' + (idx + 1));
      let titleLabel = headers.length > 1 ? headers[1] : 'DETAILS';
      let titleValue = cells.length > 1 ? cells[1].textContent.trim() : '';
      let subtitleValue = '';
      let startIndex = 2;

      // If Col 0 is a descriptive entity (Medication, Drug, Ward, Staff, Test Name)
      if (/medication|drug|ward|staff|indicator|test name/i.test(headers[0])) {
        idLabel = 'ITEM #' + (idx + 1);
        idValue = cells[0].textContent.trim();
        titleLabel = headers[0];
        titleValue = cells[0].textContent.trim();
        startIndex = 1;
      } else if (titleValue === '—' || titleValue === '-' || !titleValue) {
        titleLabel = headers[0];
        titleValue = idValue;
        startIndex = 1;
      } else if (cells.length > 2 && !cells[2].querySelector('a, button, .pill') && cells[2].textContent.trim() !== '—') {
        subtitleValue = cells[2].textContent.trim();
        startIndex = 3;
      }

      const headerRow = document.createElement('div');
      headerRow.className = 'dash-card-header';
      headerRow.innerHTML = `
        <span class="dash-card-lbl">${idLabel}</span>
        <span class="dash-card-id">${idValue}</span>
      `;
      card.appendChild(headerRow);

      // 2. Main title block
      if (titleValue) {
        const mainBlock = document.createElement('div');
        mainBlock.className = 'dash-card-main';
        mainBlock.innerHTML = `
          <div class="dash-card-category">${titleLabel}</div>
          <div class="dash-card-title">${titleValue}</div>
          ${subtitleValue ? `<div class="dash-card-subtitle">${subtitleValue}</div>` : ''}
        `;
        card.appendChild(mainBlock);
      }

      // 3. Key-Value Rows (Remaining columns)
      for (let i = startIndex; i < cells.length; i++) {
        const lbl = headers[i] || 'DETAIL';
        const cell = cells[i];

        const row = document.createElement('div');
        row.className = 'dash-card-row';

        const rowLbl = document.createElement('span');
        rowLbl.className = 'dash-card-row-lbl';
        rowLbl.textContent = lbl;
        row.appendChild(rowLbl);

        const rowVal = document.createElement('div');
        rowVal.className = 'dash-card-row-val';

        // Check for interactive button / link
        const actionBtn = cell.querySelector('a, button');
        const pillElem = cell.querySelector('.pill, .status-badge');

        if (actionBtn) {
          const btnClone = actionBtn.cloneNode(true);
          btnClone.className = 'dash-card-btn';
          if (!btnClone.querySelector('i')) {
            btnClone.innerHTML = '<i class="fa fa-file-lines"></i> ' + btnClone.textContent.trim();
          }
          rowVal.appendChild(btnClone);
        } else if (pillElem) {
          const pillText = pillElem.textContent.trim();
          const pillClone = document.createElement('span');
          const isAmber = /pending|due|review|in-progress|moderate/i.test(pillText);
          const isRose = /critical|urgent|high|overdue/i.test(pillText);
          pillClone.className = 'dash-card-pill' + (isAmber ? ' pill-amber' : isRose ? ' pill-rose' : '');
          pillClone.innerHTML = (isAmber ? '<i class="fa fa-clock"></i> ' : isRose ? '<i class="fa fa-triangle-exclamation"></i> ' : '<i class="fa fa-check"></i> ') + pillText;
          rowVal.appendChild(pillClone);
        } else {
          const text = cell.textContent.trim();
          if (/^(resolved|completed|normal|active|paid|confirmed|ok)$/i.test(text)) {
            const pillSpan = document.createElement('span');
            pillSpan.className = 'dash-card-pill';
            pillSpan.innerHTML = '<i class="fa fa-check"></i> ' + text;
            rowVal.appendChild(pillSpan);
          } else if (/^(pending|due|in-progress|moderate|review)$/i.test(text)) {
            const pillSpan = document.createElement('span');
            pillSpan.className = 'dash-card-pill pill-amber';
            pillSpan.innerHTML = '<i class="fa fa-clock"></i> ' + text;
            rowVal.appendChild(pillSpan);
          } else if (/^(critical|urgent|high|overdue)$/i.test(text)) {
            const pillSpan = document.createElement('span');
            pillSpan.className = 'dash-card-pill pill-rose';
            pillSpan.innerHTML = '<i class="fa fa-triangle-exclamation"></i> ' + text;
            rowVal.appendChild(pillSpan);
          } else {
            rowVal.textContent = text;
          }
        }

        row.appendChild(rowVal);
        card.appendChild(row);
      }

      cardsContainer.appendChild(card);
    });

    // Ensure table is wrapped in .table-responsive for desktop
    let wrapper = table.parentElement;
    if (!wrapper.classList.contains('table-responsive')) {
      wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      wrapper.scrollLeft = 0;
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    // Insert cardsContainer directly after wrapper
    wrapper.parentNode.insertBefore(cardsContainer, wrapper.nextSibling);
  });
});

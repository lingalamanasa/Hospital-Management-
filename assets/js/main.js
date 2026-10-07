/**
 * Stackly Health Management System
 * Dynamic GSAP Animations, ScrollTriggers & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins if available
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Hero Entrance Animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

    if (document.querySelector('.hero-trust-tag')) {
      const isMobile = window.innerWidth <= 768;
      heroTl.from('.hero-trust-tag', { opacity: 0, y: -20 })
            .from('.hero-title', { opacity: 0, y: 30 }, '-=0.4')
            .from('.hero-desc', { opacity: 0, y: 20 }, '-=0.5')
            .from('.hero-actions .btn', { opacity: 0, scale: 0.9, stagger: 0.15 }, '-=0.4')
            .from('.hero-stats-row .hero-stat-item', { opacity: 0, y: 20, stagger: 0.1 }, '-=0.3')
            .from('.hero-device-card', { opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 25 : 0, duration: 1 }, '-=0.8')
            .from('.floating-badge', { opacity: 0, scale: 0.5, stagger: 0.2, ease: 'back.out(1.7)' }, '-=0.4');
    }

    // 2. Floating Badge Idle Hover Effect
    gsap.to('.badge-top-left', {
      y: -10,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.badge-bottom-right', {
      y: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });

    // 3. ScrollTrigger Stagger for Cards using ScrollTrigger.batch (Cards never hidden)
    const cardSelectors = [
      '.sector-card',
      '.module-card',
      '.workflow-step',
      '.compliance-card',
      '.testimonial-card',
      '.blog-card',
      '.info-box',
      '.timeline-item',
      '.team-card',
      '.metric-item'
    ].join(', ');

    const allCards = document.querySelectorAll(cardSelectors);
    
    // Ensure all cards are visible by default
    allCards.forEach(c => {
      c.style.visibility = 'visible';
    });

    if (typeof ScrollTrigger !== 'undefined' && allCards.length > 0) {
      ScrollTrigger.batch(cardSelectors, {
        interval: 0.1,
        batchMax: 6,
        start: 'top 95%',
        once: true,
        onEnter: batch => {
          gsap.fromTo(batch,
            { opacity: 0, y: 28, scale: 0.96, rotation: -1.2 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power2.out',
              clearProps: 'opacity,transform,rotation'
            }
          );
        }
      });
    }

    // Refresh ScrollTrigger when images load to update scroll positions
    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });

    // Failsafe: After 500ms, force full opacity on any card that hasn't animated
    setTimeout(() => {
      allCards.forEach(el => {
        if (window.getComputedStyle(el).opacity === '0' || el.style.opacity === '0') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 500);

    // 4. Metric Number Counters with GSAP
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                counter.innerText = prefix + (decimals > 0 ? obj.val.toFixed(decimals) : Math.floor(obj.val).toLocaleString()) + suffix;
              }
            });
          }
        });
      }
    });

    // 5. Fixed Navbar Shadow on Scroll
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      document.body.classList.add('has-fixed-header');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      });
    }
  }

  // 6. Interactive Tab Switching (for Showcase & Modules)
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      const parentContainer = btn.closest('.tabs-wrapper') || document;
      
      parentContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parentContainer.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetPane, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      }
    });
  });

  // 7. Interactive Role Switcher in Login & Signup
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const role = btn.getAttribute('data-role');
      const roleInput = document.getElementById('selectedRole');
      if (roleInput) roleInput.value = role;

      const adminFields = document.querySelectorAll('.admin-only');
      const userFields = document.querySelectorAll('.user-only');

      if (role === 'admin') {
        adminFields.forEach(f => f.style.display = 'block');
        userFields.forEach(f => f.style.display = 'none');
        document.getElementById('authSubmitBtn').innerText = 'Access Hospital Admin Console';
      } else {
        adminFields.forEach(f => f.style.display = 'none');
        userFields.forEach(f => f.style.display = 'block');
        document.getElementById('authSubmitBtn').innerText = 'Sign In to Patient / Doctor Portal';
      }
    });
  });

  // 8. Spring-Board Mobile Menu Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let navBackdrop = document.querySelector('.nav-backdrop');

  if (!navBackdrop && mobileToggle && navMenu) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  // Ensure login/signup actions are available inside mobile menu drawer
  if (navMenu && !navMenu.querySelector('.nav-menu-actions')) {
    const mobileActions = document.createElement('div');
    mobileActions.className = 'nav-menu-actions';
    mobileActions.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm"><i class="fa fa-arrow-right-to-bracket"></i> Login</a>
      <a href="signup.html" class="btn btn-primary btn-sm"><i class="fa fa-user-plus"></i> Signup</a>
    `;
    navMenu.appendChild(mobileActions);
  }

  function openMobileMenu() {
    if (!navMenu || !mobileToggle) return;
    mobileToggle.classList.add('active');
    navMenu.classList.remove('closing');
    navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!navMenu || !mobileToggle) return;
    if (!navMenu.classList.contains('active')) return;
    mobileToggle.classList.remove('active');
    navMenu.classList.add('closing');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      navMenu.classList.remove('active');
      navMenu.classList.remove('closing');
    }, 240);
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // 9. Reusable Wobble Card Enter Animation
  const wobbleTargetSelectors = [
    '.module-card',
    '.sector-card',
    '.blog-card',
    '.compliance-card',
    '.testimonial-card',
    '.info-box',
    '.workflow-step',
    '.team-card',
    '.metric-item',
    '.showcase-card',
    '.contact-form-card',
    '.wobble-card'
  ].join(', ');

  const wobbleCards = document.querySelectorAll(wobbleTargetSelectors);

  if ('IntersectionObserver' in window && wobbleCards.length > 0) {
    const wobbleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const stagger = (idx % 3) * 0.08;
          card.style.animationDelay = `${stagger}s`;
          card.classList.add('wobble-card-enter');
          observer.unobserve(card);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.1
    });

    wobbleCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        card.classList.add('wobble-card-enter');
      } else {
        card.classList.add('wobble-card-ready');
        wobbleObserver.observe(card);
      }
    });

    // Safety fallback: ensure every card is fully visible within 1.2s
    setTimeout(() => {
      wobbleCards.forEach(c => {
        c.classList.remove('wobble-card-ready');
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
    }, 1200);
  } else {
    wobbleCards.forEach(c => {
      c.style.opacity = '1';
      c.style.visibility = 'visible';
    });
  }
});

// Quick Credentials Autofill helper for demo testing
function fillCredentials(role) {
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  const roleInput = document.getElementById('selectedRole');

  if (role === 'admin') {
    if (emailInput) emailInput.value = 'admin@apollohealth.org';
    if (passInput) passInput.value = 'AdminSecure@2026';
    const adminTab = document.querySelector('.role-tab-btn[data-role="admin"]');
    if (adminTab) adminTab.click();
  } else {
    if (emailInput) emailInput.value = 'sarah.miller@patientcare.com';
    if (passInput) passInput.value = 'UserHealth@2026';
    const userTab = document.querySelector('.role-tab-btn[data-role="user"]');
    if (userTab) userTab.click();
  }
}

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
      heroTl.from('.hero-trust-tag', { opacity: 0, y: -20 })
            .from('.hero-title', { opacity: 0, y: 30 }, '-=0.4')
            .from('.hero-desc', { opacity: 0, y: 20 }, '-=0.5')
            .from('.hero-actions .btn', { opacity: 0, scale: 0.9, stagger: 0.15 }, '-=0.4')
            .from('.hero-stats-row .hero-stat-item', { opacity: 0, y: 20, stagger: 0.1 }, '-=0.3')
            .from('.hero-device-card', { opacity: 0, x: 50, duration: 1 }, '-=0.8')
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
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
              clearProps: 'opacity,transform'
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

    // 5. Navbar Sticky GSAP Effect
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
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

  // 8. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#FFFFFF';
        navMenu.style.padding = '24px';
        navMenu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      }
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

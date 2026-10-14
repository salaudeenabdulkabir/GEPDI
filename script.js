/* ============================================================
   GEPDI Website – script.js
   Modern interactions, animations, and UI behaviors
   ============================================================ */

(function () {
  'use strict';

  /* ========================================================
     NAVIGATION
     ======================================================== */
  const navHeader = document.getElementById('nav-header');
  const navHamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link[data-section]');

  // Sticky nav + at-top class
  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navHeader.classList.add('scrolled');
      navHeader.classList.remove('at-top');
    } else {
      navHeader.classList.remove('scrolled');
      navHeader.classList.add('at-top');
    }
    updateActiveLink();
  }
  navHeader.classList.add('at-top');
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Hamburger toggle
  navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link based on scroll
  function updateActiveLink() {
    const sections = ['home', 'about', 'programs', 'impact', 'news', 'faq', 'contact'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) {
        current = id;
      }
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* ========================================================
     SMOOTH SCROLL FOR NAV LINKS
     ======================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navHeader.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ========================================================
     HERO PARTICLES
     ======================================================== */
  const particleContainer = document.getElementById('hero-particles');
  if (particleContainer) {
    const colors = ['rgba(0,229,160,0.4)', 'rgba(34,163,96,0.3)', 'rgba(255,255,255,0.2)'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      const x = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 20 + 15;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}%; bottom:-20px;
        background:${color};
        animation-duration:${duration}s;
        animation-delay:-${delay}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ========================================================
     COUNTER ANIMATION
     ======================================================== */
  function animateCounter(el, target, suffix, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ========================================================
     SCROLL REVEAL
     ======================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Add reveal class to key elements
  const revealTargets = [
    '.mv-card', '.value-card', '.program-card', '.impact-card',
    '.news-card', '.partner-logo-card', '.contact-info-card',
    '.about-content', '.about-image-col', '.pillar-item',
    '.section-header', '.cta-text', '.newsletter-form-wrapper',
    '.faq-item'
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 6) el.classList.add(`reveal-delay-${i + 1}`);
      revealObserver.observe(el);
    });
  });

  /* ========================================================
     BACK TO TOP
     ======================================================== */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================================
     TOAST NOTIFICATION
     ======================================================== */
  function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  /* ========================================================
     FORMS
     ======================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('sub-name').value.trim();
      const email = document.getElementById('sub-email').value.trim();
      if (!name || !email) return;
      // Simulate submission
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Subscribing…';
      btn.disabled = true;
      setTimeout(() => {
        this.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        showToast('Thank you! You have successfully subscribed to our newsletter.');
      }, 1500);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        this.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        showToast('Message sent! We will get back to you within 48 hours.');
      }, 1800);
    });
  }

  /* ========================================================
     DONATE BUTTON EFFECT
     ======================================================== */
  const donateBtn = document.getElementById('donate-btn');
  if (donateBtn) {
    // Pulse animation on hover
    donateBtn.addEventListener('mouseenter', function () {
      this.style.animation = 'none';
    });
  }

  /* ========================================================
     TICKER PAUSE ON HOVER
     ======================================================== */
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  /* ========================================================
     MOBILE DROPDOWN
     ======================================================== */
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });

  /* ========================================================
     PARALLAX SUBTLE EFFECT ON HERO
     ======================================================== */
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ========================================================
     PROGRAM CARDS HOVER TILT EFFECT
     ======================================================== */
  document.querySelectorAll('.program-card, .mv-card, .news-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `translateY(-6px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
      this.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  /* ========================================================
     INPUT FLOATING LABEL EFFECT
     ======================================================== */
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
    });
  });

  /* ========================================================
     FAQ ACCORDION
     ======================================================== */
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      // Close all other open FAQ items (smooth accordion behavior)
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
          const otherTrigger = openItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ========================================================
     LOAD ANIMATION
     ======================================================== */
  document.documentElement.classList.add('js-loaded');

  console.log('%cGEPDI Website', 'color:#22a360;font-size:20px;font-weight:bold;');
  console.log('%cGlobal Environment, Policy and Development Initiative', 'color:#0d1f3c;font-size:12px;');

})();

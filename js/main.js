/* =====================================================
   PORTFOLIO 3.0 — MAIN JS
   Yoiner TN | 2026
   ===================================================== */

'use strict';

// ── Reduced Motion Check ──
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── ════════════════════════════════
//    SCROLL PROGRESS BAR
// ═══════════════════════════════════
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollMax  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width  = `${(scrollTop / scrollMax) * 100}%`;
  }, { passive: true });
}

// ── ════════════════════════════════
//    NAVBAR — scroll + active link
// ═══════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));

  // Smooth scroll on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
          history.pushState(null, '', href);
          closeMobileMenu();
        }
      }
    });
  });
}

// ── ════════════════════════════════
//    MOBILE MENU
// ═══════════════════════════════════
function initMobileMenu() {
  const btn  = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function closeMobileMenu() {
  const btn  = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.remove('open');
  btn?.classList.remove('open');
  btn?.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
}

// ── ════════════════════════════════
//    REVEAL ON SCROLL
// ═══════════════════════════════════
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    elements.forEach(el => {
      el.classList.add('visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── ════════════════════════════════
//    COUNTER ANIMATION (hero stats)
// ═══════════════════════════════════
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '+';
  const duration = 1400;
  const step = 30;
  const steps = Math.ceil(duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current++;
    const value = Math.round((current / steps) * target);
    el.textContent = value + suffix;
    if (current >= steps) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        if (!prefersReducedMotion) {
          animateCounter(entry.target);
        } else {
          const target = entry.target.dataset.count;
          const suffix = entry.target.dataset.suffix || '+';
          entry.target.textContent = target + suffix;
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── ════════════════════════════════
//    TYPEWRITER EFFECT
// ═══════════════════════════════════
function initTypewriter() {
  const el = document.getElementById('typewriter-target');
  if (!el || prefersReducedMotion) return;

  const texts = [
    'Desarrollador Frontend',
    'React Developer',
    'UI/UX Enthusiast',
    'Angular Developer',
    'Creador de Interfaces'
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, --charIndex);
    } else {
      el.textContent = current.substring(0, ++charIndex);
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

// ── ════════════════════════════════
//    CUSTOM CURSOR
// ═══════════════════════════════════
function initCustomCursor() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;
  if (prefersReducedMotion) return;

  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  if (!outer || !inner) return;

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = `${mouseX}px`;
    inner.style.top  = `${mouseY}px`;
  });

  function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = `${outerX}px`;
    outer.style.top  = `${outerY}px`;
    requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll('a, button, [role="button"]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide on mouse leave
  document.addEventListener('mouseleave', () => {
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });
}

// ── ════════════════════════════════
//    SKILLS FILTER
// ═══════════════════════════════════
function initSkillsFilter() {
  const buttons = document.querySelectorAll('.skill-cat-btn');
  const cards   = document.querySelectorAll('.skill-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0.15';
          card.style.transform = 'scale(0.95)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
}

// ── ════════════════════════════════
//    PARTICLES (Canvas)
// ═══════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const PARTICLE_COUNT = Math.min(60, Math.floor(W * H / 18000));
  const CONNECTION_DIST = 110;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = Math.random() * 0.3 + 0.1;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.35 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.a})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, 200);
  }, { passive: true });

  animate();

  return () => {
    cancelAnimationFrame(animId);
  };
}

// ── ════════════════════════════════
//    THREE.JS — Hero 3D Background
// ═══════════════════════════════════
function initThreeJS() {
  const container = document.getElementById('hero-3d');
  if (!container || !window.THREE || prefersReducedMotion) return;

  try {
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, W(), H(), 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W(), H());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Multiple meshes
    const meshes = [];

    // TorusKnot
    const geo1  = new THREE.TorusKnotGeometry(7, 1.8, 80, 10);
    const mat1  = new THREE.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true, transparent: true, opacity: 0.18 });
    const knot  = new THREE.Mesh(geo1, mat1);
    scene.add(knot);
    meshes.push(knot);

    // Icosahedron
    const geo2  = new THREE.IcosahedronGeometry(4, 1);
    const mat2  = new THREE.MeshBasicMaterial({ color: 0x00D4FF, wireframe: true, transparent: true, opacity: 0.12 });
    const ico   = new THREE.Mesh(geo2, mat2);
    ico.position.set(18, 10, -10);
    scene.add(ico);
    meshes.push(ico);

    // Octahedron
    const geo3  = new THREE.OctahedronGeometry(3, 0);
    const mat3  = new THREE.MeshBasicMaterial({ color: 0xEC4899, wireframe: true, transparent: true, opacity: 0.1 });
    const oct   = new THREE.Mesh(geo3, mat3);
    oct.position.set(-20, -8, -5);
    scene.add(oct);
    meshes.push(oct);

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / W() - 0.5) * 2;
      mouseY = (e.clientY / H() - 0.5) * 2;
    });

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);

      knot.rotation.x += 0.003 + mouseY * 0.0008;
      knot.rotation.y += 0.004 + mouseX * 0.0008;

      ico.rotation.x  += 0.005;
      ico.rotation.z  += 0.003;

      oct.rotation.y  += 0.006;
      oct.rotation.x  -= 0.003;

      renderer.render(scene, camera);
    }

    function onResize() {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    }

    window.addEventListener('resize', onResize, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

  } catch (err) {
    console.warn('Three.js init failed:', err);
  }
}

function W() { return window.innerWidth; }
function H() { return window.innerHeight; }

// ── ════════════════════════════════
//    MAGNETIC BUTTONS
// ═══════════════════════════════════
function initMagneticButtons() {
  if (prefersReducedMotion || 'ontouchstart' in window) return;

  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── ════════════════════════════════
//    UTILITY: current year
// ═══════════════════════════════════
function setCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ── ════════════════════════════════
//    SMOOTH SCROLL for all anchor links
// ═══════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    });
  });
}

// ── ════════════════════════════════
//    FLOATING NAV MENU
// ═══════════════════════════════════
function initFloatingNav() {
  const container = document.querySelector('.floating-nav-container');
  const toggleBtn = document.getElementById('floating-nav-toggle');
  const menu = document.getElementById('floating-nav-menu');
  const links = document.querySelectorAll('.floating-nav-link');
  
  if (!container || !toggleBtn || !menu) return;

  // Show container after scrolling down OR if on mobile
  function updateVisibility() {
    if (window.scrollY > 300 || window.innerWidth <= 768) {
      container.classList.add('visible');
    } else {
      container.classList.remove('visible');
      // Auto-close menu if we scroll all the way up on desktop
      if (window.scrollY === 0) {
        closeMenu();
      }
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  // Check immediately on load
  updateVisibility();

  // Toggle menu visibility
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !container.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  function openMenu() {
    menu.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
}

// ── ════════════════════════════════
//    INIT
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initReveal();
  initCounters();
  initTypewriter();
  initCustomCursor();
  initSkillsFilter();
  initMagneticButtons();
  initSmoothScroll();
  initFloatingNav();

  const cleanupParticles = initParticles();
  const cleanupThreeJS   = initThreeJS();

  window.addEventListener('beforeunload', () => {
    cleanupParticles?.();
    cleanupThreeJS?.();
  });
});

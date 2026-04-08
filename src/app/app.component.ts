import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { BackgroundEffectsComponent } from './background-effects/background-effects.component';
import { ContentSectionsComponent } from './content-sections/content-sections.component';
import { HeroComponent } from './hero/hero.component';
import { NavbarComponent } from './navbar/navbar.component';

declare const THREE: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BackgroundEffectsComponent, NavbarComponent, HeroComponent, ContentSectionsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {

  private prefersReducedMotion = false;
  private readonly cleanupTasks: Array<() => void> = [];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.addCleanup(this.initScrollProgress());
    this.addCleanup(this.initNavbar());
    this.addCleanup(this.initMobileMenu());
    this.addCleanup(this.initReveal());
    this.addCleanup(this.initCounters());
    this.addCleanup(this.initTypewriter());
    this.addCleanup(this.initCustomCursor());
    this.addCleanup(this.initSkillsFilter());
    this.addCleanup(this.initMagneticButtons());
    this.addCleanup(this.initSmoothScroll());
    this.addCleanup(this.initFloatingNav());
    this.addCleanup(this.initParticles());
    this.addCleanup(this.initThreeJS());

    this.setCurrentYear();
  }

  ngOnDestroy(): void {
    while (this.cleanupTasks.length) {
      this.cleanupTasks.pop()?.();
    }
  }

  private addCleanup(cleanup?: (() => void) | void): void {
    if (cleanup) {
      this.cleanupTasks.push(cleanup);
    }
  }

  private initScrollProgress(): (() => void) | void {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const controller = new AbortController();
    const update = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = scrollMax > 0 ? `${(scrollTop / scrollMax) * 100}%` : '0%';
    };

    window.addEventListener('scroll', update, { passive: true, signal: controller.signal });
    update();

    return () => controller.abort();
  }

  private initNavbar(): (() => void) | void {
    const navbar = document.getElementById('navbar');
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link'));
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));

    if (!navbar || !navLinks.length || !sections.length) return;

    const controller = new AbortController();

    const updateScrolledState = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    window.addEventListener('scroll', updateScrolledState, { passive: true, signal: controller.signal });
    sections.forEach((section) => observer.observe(section));
    updateScrolledState();

    return () => {
      controller.abort();
      observer.disconnect();
    };
  }

  private initMobileMenu(): (() => void) | void {
    const btn = document.getElementById('nav-hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const controller = new AbortController();

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    }, { signal: controller.signal });

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Node)) return;
      if (!btn.contains(event.target) && !menu.contains(event.target)) {
        this.closeMobileMenu();
      }
    }, { signal: controller.signal });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeMobileMenu();
      }
    }, { signal: controller.signal });

    return () => controller.abort();
  }

  private closeMobileMenu(): void {
    const btn = document.getElementById('nav-hamburger');
    const menu = document.getElementById('mobile-menu');

    if (!menu) return;

    menu.classList.remove('open');
    btn?.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  private initReveal(): (() => void) | void {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!elements.length) return;

    if (this.prefersReducedMotion) {
      elements.forEach((el) => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }

  private animateCounter(el: HTMLElement, timers?: Set<number>): void {
    const target = Number.parseInt(el.dataset['count'] ?? '0', 10);
    const suffix = el.dataset['suffix'] || '+';
    const duration = 1400;
    const step = 30;
    const steps = Math.ceil(duration / step);
    let current = 0;

    const timer = window.setInterval(() => {
      current += 1;
      const value = Math.round((current / steps) * target);
      el.textContent = `${value}${suffix}`;

      if (current >= steps) {
        el.textContent = `${target}${suffix}`;
        clearInterval(timer);
        timers?.delete(timer);
      }
    }, step);

    timers?.add(timer);
  }

  private initCounters(): (() => void) | void {
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    if (!counters.length) return;

    if (this.prefersReducedMotion) {
      counters.forEach((counter) => {
        const target = counter.dataset['count'] ?? '0';
        const suffix = counter.dataset['suffix'] || '+';
        counter.textContent = `${target}${suffix}`;
      });
      return;
    }

    const activeTimers = new Set<number>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const targetEl = entry.target as HTMLElement;
        if (!entry.isIntersecting || targetEl.dataset['animated']) return;

        targetEl.dataset['animated'] = 'true';
        this.animateCounter(targetEl, activeTimers);
        observer.unobserve(targetEl);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));

    return () => {
      observer.disconnect();
      activeTimers.forEach((id) => clearInterval(id));
      activeTimers.clear();
    };
  }

  private initTypewriter(): (() => void) | void {
    const el = document.getElementById('typewriter-target');
    if (!el || this.prefersReducedMotion) return;

    const texts = [
      'Desarrollador Frontend',
      'React Developer',
      'UI/UX Enthusiast',
      'Angular Developer',
      'Creador de Interfaces',
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let stopped = false;
    let timeoutId: number | undefined;

    const tick = () => {
      if (stopped) return;

      const current = texts[textIndex];

      if (isDeleting) {
        charIndex -= 1;
        el.textContent = current.substring(0, charIndex);
      } else {
        charIndex += 1;
        el.textContent = current.substring(0, charIndex);
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

      timeoutId = window.setTimeout(tick, delay);
    };

    tick();

    return () => {
      stopped = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }

  private initCustomCursor(): (() => void) | void {
    if (this.prefersReducedMotion || 'ontouchstart' in window) return;

    const outer = document.getElementById('cursor-outer');
    const inner = document.getElementById('cursor-inner');
    if (!outer || !inner) return;

    const controller = new AbortController();
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    let rafId = 0;

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      inner.style.left = `${mouseX}px`;
      inner.style.top = `${mouseY}px`;
    }, { signal: controller.signal });

    const animateOuter = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      outer.style.left = `${outerX}px`;
      outer.style.top = `${outerY}px`;
      rafId = window.requestAnimationFrame(animateOuter);
    };

    animateOuter();

    const interactives = document.querySelectorAll<HTMLElement>('a, button, [role="button"]');
    interactives.forEach((element) => {
      element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { signal: controller.signal });
      element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { signal: controller.signal });
    });

    document.addEventListener('mouseleave', () => {
      outer.style.opacity = '0';
      inner.style.opacity = '0';
    }, { signal: controller.signal });

    document.addEventListener('mouseenter', () => {
      outer.style.opacity = '1';
      inner.style.opacity = '1';
    }, { signal: controller.signal });

    return () => {
      controller.abort();
      cancelAnimationFrame(rafId);
    };
  }

  private initSkillsFilter(): (() => void) | void {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.skill-cat-btn'));
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.skill-card'));
    if (!buttons.length || !cards.length) return;

    const controller = new AbortController();

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((button) => button.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset['filter'];

        cards.forEach((card) => {
          const category = card.dataset['category'];
          const show = filter === 'all' || category === filter;

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
      }, { signal: controller.signal });
    });

    return () => controller.abort();
  }

  private initParticles(): (() => void) | void {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement | null;
    if (!canvas || this.prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = Math.min(60, Math.floor((width * height) / 18000));
    const connectionDistance = 110;

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      r = 0;
      a = 0;

      constructor() {
        this.reset(true);
      }

      reset(initial = false): void {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = Math.random() * 0.3 + 0.1;
        this.r = Math.random() * 1.5 + 0.5;
        this.a = Math.random() * 0.35 + 0.1;
      }

      update(): void {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw(): void {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(0, 212, 255, ${this.a})`;
        context.fill();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());
    const controller = new AbortController();
    let animationId = 0;
    let resizeTimer = 0;

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
          const alpha = (1 - distance / connectionDistance) * 0.12;
            context.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            context.lineWidth = 0.6;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      drawConnections();
      animationId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true, signal: controller.signal });
    animate();

    return () => {
      controller.abort();
      cancelAnimationFrame(animationId);
      window.clearTimeout(resizeTimer);
    };
  }

  private initThreeJS(): (() => void) | void {
    const container = document.getElementById('hero-3d');
    if (!container || typeof THREE === 'undefined' || this.prefersReducedMotion) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 28;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const meshes: any[] = [];

      const geo1 = new THREE.TorusKnotGeometry(7, 1.8, 80, 10);
      const mat1 = new THREE.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true, transparent: true, opacity: 0.18 });
      const knot = new THREE.Mesh(geo1, mat1);
      scene.add(knot);
      meshes.push(knot);

      const geo2 = new THREE.IcosahedronGeometry(4, 1);
      const mat2 = new THREE.MeshBasicMaterial({ color: 0x00D4FF, wireframe: true, transparent: true, opacity: 0.12 });
      const ico = new THREE.Mesh(geo2, mat2);
      ico.position.set(18, 10, -10);
      scene.add(ico);
      meshes.push(ico);

      const geo3 = new THREE.OctahedronGeometry(3, 0);
      const mat3 = new THREE.MeshBasicMaterial({ color: 0xEC4899, wireframe: true, transparent: true, opacity: 0.1 });
      const oct = new THREE.Mesh(geo3, mat3);
      oct.position.set(-20, -8, -5);
      scene.add(oct);
      meshes.push(oct);

      let mouseX = 0;
      let mouseY = 0;
      const controller = new AbortController();

      document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      }, { signal: controller.signal });

      let animationId = 0;

      const animate = () => {
        animationId = window.requestAnimationFrame(animate);

        knot.rotation.x += 0.003 + mouseY * 0.0008;
        knot.rotation.y += 0.004 + mouseX * 0.0008;

        ico.rotation.x += 0.005;
        ico.rotation.z += 0.003;

        oct.rotation.y += 0.006;
        oct.rotation.x -= 0.003;

        renderer.render(scene, camera);
      };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', onResize, { passive: true, signal: controller.signal });
      animate();

      return () => {
        controller.abort();
        cancelAnimationFrame(animationId);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (error) {
      console.warn('Three.js init failed:', error);
      return;
    }
  }

  private initMagneticButtons(): (() => void) | void {
    if (this.prefersReducedMotion || 'ontouchstart' in window) return;

    const controller = new AbortController();

    document.querySelectorAll<HTMLElement>('.btn-primary, .btn-outline').forEach((btn) => {
      btn.addEventListener('mousemove', (event) => {
        const rect = btn.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      }, { signal: controller.signal });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      }, { signal: controller.signal });
    });

    return () => controller.abort();
  }

  private initSmoothScroll(): (() => void) | void {
    const controller = new AbortController();

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      if (anchor.classList.contains('floating-nav-link')) return;

      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: this.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', href);

        if (anchor.classList.contains('nav-link') || anchor.closest('#mobile-menu')) {
          this.closeMobileMenu();
        }
      }, { signal: controller.signal });
    });

    return () => controller.abort();
  }

  private initFloatingNav(): (() => void) | void {
    const container = document.querySelector<HTMLElement>('.floating-nav-container');
    const toggleBtn = document.getElementById('floating-nav-toggle') as HTMLButtonElement | null;
    const menu = document.getElementById('floating-nav-menu');
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.floating-nav-link'));

    if (!container || !toggleBtn || !menu) return;

    const controller = new AbortController();

    const openMenu = () => {
      menu.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    };

    const updateVisibility = () => {
      if (window.scrollY > 300 || window.innerWidth <= 768) {
        container.classList.add('visible');
      } else {
        container.classList.remove('visible');
        if (window.scrollY === 0) {
          closeMenu();
        }
      }
    };

    window.addEventListener('scroll', updateVisibility, { passive: true, signal: controller.signal });
    window.addEventListener('resize', updateVisibility, { passive: true, signal: controller.signal });
    updateVisibility();

    toggleBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }, { signal: controller.signal });

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        closeMenu();

        const targetId = link.getAttribute('href');
        const target = targetId ? document.querySelector<HTMLElement>(targetId) : null;

        if (target) {
          target.scrollIntoView({ behavior: this.prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }, { signal: controller.signal });
    });

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Node)) return;
      if (menu.classList.contains('open') && !container.contains(event.target)) {
        closeMenu();
      }
    }, { signal: controller.signal });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    }, { signal: controller.signal });

    return () => controller.abort();
  }

  private setCurrentYear(): void {
    const el = document.getElementById('current-year');
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }
}

// Configuración global
const CONFIG = {
  particles: {
    count: 50, // Reducido para mejor rendimiento
    color: 'rgba(0, 212, 255, 0.5)',
    maxSize: 2,
    connectionDistance: 100
  },
  threeJS: {
    cameraZ: 30,
    wireframeColor: 0x00d4ff,
    opacity: 0.3
  },
  animations: {
    scrollDebounce: 100,
    resizeDebounce: 200
  }
};

// Inicializar partículas con mejor rendimiento
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Clase de partícula optimizada
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * CONFIG.particles.maxSize + 1;
      this.speedX = Math.random() * 1 - 0.5; // Reducida velocidad
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.3 + 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Rebote en bordes
      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    
    draw() {
      ctx.fillStyle = CONFIG.particles.color.replace('0.5', this.opacity);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Crear partículas
  const particles = Array.from({ length: CONFIG.particles.count }, () => new Particle());
  
  // Función de animación optimizada
  let animationId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar partículas
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Dibujar conexiones (solo si el rendimiento lo permite)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawConnections(particles);
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  function drawConnections(particles) {
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONFIG.particles.connectionDistance) {
          ctx.strokeStyle = CONFIG.particles.color.replace('0.5', (0.2 - distance/CONFIG.particles.connectionDistance));
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });
  }
  
  // Manejar redimensionamiento con debounce
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, CONFIG.animations.resizeDebounce);
  }
  
  // Iniciar
  window.addEventListener('resize', handleResize);
  
  // Solo iniciar animación si no hay preferencia de movimiento reducido
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  }
  
  // Cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', handleResize);
  };
}

// Inicializar Three.js optimizado
function initThreeJS() {
  const container = document.getElementById('hero-3d');
  if (!container || !window.THREE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  try {
    // Escena
    const scene = new THREE.Scene();
    
    // Cámara
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = CONFIG.threeJS.cameraZ;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar pixel ratio
    container.appendChild(renderer.domElement);
    
    // Geometría optimizada
    const geometry = new THREE.TorusKnotGeometry(8, 2, 64, 8); // Reducida complejidad
    const material = new THREE.MeshBasicMaterial({ 
      color: CONFIG.threeJS.wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: CONFIG.threeJS.opacity
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Variables de mouse
    let mouseX = 0;
    let mouseY = 0;
    
    // Animación optimizada
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      
      torusKnot.rotation.x += 0.003; // Reducida velocidad
      torusKnot.rotation.y += 0.003;
      
      // Efecto de mouse suavizado
      torusKnot.rotation.x += mouseY * 0.0001;
      torusKnot.rotation.y += mouseX * 0.0001;
      
      renderer.render(scene, camera);
    }
    
    // Eventos
    function onMouseMove(event) {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }
    
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Configurar eventos
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar animación
    animate();
    
    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  } catch (error) {
    console.warn('Three.js no pudo inicializarse:', error);
  }
}

// Navegación suave mejorada
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Respetar preferencias de movimiento reducido
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        
        target.scrollIntoView({
          behavior: behavior,
          block: 'start'
        });
        
        // Actualizar URL sin recargar la página
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });
}

// Menú móvil mejorado
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    if (isHidden) {
      menu.classList.remove('hidden');
      setTimeout(() => menu.classList.remove('-translate-y-full'), 10);
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      
      // Trap focus dentro del menú
      trapFocus(menu);
    } else {
      menu.classList.add('-translate-y-full');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      
      setTimeout(() => {
        if (menu.classList.contains('-translate-y-full')) {
          menu.classList.add('hidden');
        }
      }, 300);
    }
  });

  // Cerrar al hacer clic en enlace
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('-translate-y-full');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 300);
    });
  });
  
  // Cerrar al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.click();
    }
  });
}

// Trap focus para accesibilidad
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
  
  firstElement.focus();
}

// Observers para animaciones mejorados
function setupIntersectionObservers() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Si el usuario prefiere movimiento reducido, mostrar todo inmediatamente
    document.querySelectorAll('.card-3d, .project-card, .skill-item').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar elementos
  const elementsToObserve = [
    ...document.querySelectorAll('.card-3d'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.skill-item')
  ];
  
  elementsToObserve.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// Efecto typewriter mejorado
function setupTypewriterEffect() {
  const elements = document.querySelectorAll('.typewriter');
  if (elements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.typed) {
        const text = entry.target.textContent;
        entry.target.textContent = '';
        typeWriter(entry.target, text, 100);
        entry.target.dataset.typed = 'true';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  elements.forEach(el => observer.observe(el));
}

function typeWriter(element, text, speed = 50) {
  let i = 0;
  
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      // Mantener el cursor parpadeando al final
      element.style.borderRight = '3px solid var(--neon-blue)';
    }
  }
  
  typing();
}

// Cursor personalizado mejorado
function setupCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'fixed w-4 h-4 bg-blue-400 rounded-full pointer-events-none z-50 transition-transform duration-100 hidden sm:block';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.8)';
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Suavizar el movimiento del cursor
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // Efectos hover
  const interactiveElements = [
    ...document.querySelectorAll('a'),
    ...document.querySelectorAll('button'),
    ...document.querySelectorAll('.cyber-btn'),
    ...document.querySelectorAll('[role="button"]')
  ];

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.backgroundColor = 'rgba(0, 212, 255, 0.3)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'rgb(96, 165, 250)';
    });
  });
}

// Actualizar año
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Clase AutoCarousel mejorada
class AutoCarousel {
  constructor() {
    this.track = document.getElementById('carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.indicatorsContainer = document.getElementById('indicators');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.slidesPerView = this.getSlidesPerView();
    this.maxSlides = Math.max(0, this.totalSlides - this.slidesPerView);
    this.autoPlayInterval = null;
    this.isAutoPlaying = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTransitioning = false;
    
    this.init();
  }
  
  init() {
    if (this.totalSlides === 0) return;
    
    this.createIndicators();
    this.bindEvents();
    this.updateCarousel();
    
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    }
    
    // Responsive handling
    window.addEventListener('resize', () => {
      this.slidesPerView = this.getSlidesPerView();
      this.maxSlides = Math.max(0, this.totalSlides - this.slidesPerView);
      this.updateCarousel();
    });
  }
  
  getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2;  // md
    return 1; // sm
  }
  
  createIndicators() {
    if (!this.indicatorsContainer) return;
    
    this.indicatorsContainer.innerHTML = '';
    const totalIndicators = Math.max(1, this.maxSlides + 1);
    
    for (let i = 0; i < totalIndicators; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('indicator');
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-label', `Ir al proyecto ${i + 1}`);
      indicator.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      
      if (i === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => {
        this.goToSlide(i);
      });
      
      this.indicatorsContainer.appendChild(indicator);
    }
  }
  
  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Pause on hover
    if (this.track) {
      this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
      this.track.addEventListener('mouseleave', () => this.resumeAutoPlay());
      this.track.addEventListener('focusin', () => this.pauseAutoPlay());
      this.track.addEventListener('focusout', () => this.resumeAutoPlay());
    }
    
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }
  
  updateCarousel() {
    if (this.isTransitioning || !this.track) return;
    
    this.isTransitioning = true;
    
    const slideWidth = 100 / this.slidesPerView;
    const translateX = -(this.currentSlide * slideWidth);
    
    this.track.style.transform = `translateX(${translateX}%)`;
    this.updateIndicators();
    this.updateAccessibility();
    
    // Reset transitioning state después de la transición
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }
  
  updateIndicators() {
    if (!this.indicatorsContainer) return;
    
    const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      const isActive = index === this.currentSlide;
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
  
  updateAccessibility() {
    // Actualizar aria-live para lectores de pantalla
    this.track.setAttribute('aria-live', 'polite');
    
    // Anunciar el slide actual para lectores de pantalla
    const currentProject = this.slides[this.currentSlide]?.querySelector('h3')?.textContent;
    if (currentProject) {
      this.track.setAttribute('aria-label', `Proyecto actual: ${currentProject}`);
    }
  }
  
  nextSlide() {
    if (this.isTransitioning) return;
    
    if (this.currentSlide < this.maxSlides) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
    this.updateCarousel();
  }
  
  prevSlide() {
    if (this.isTransitioning) return;
    
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.maxSlides;
    }
    this.updateCarousel();
  }
  
  goToSlide(index) {
    if (this.isTransitioning) return;
    
    this.currentSlide = Math.max(0, Math.min(index, this.maxSlides));
    this.updateCarousel();
  }
  
  startAutoPlay() {
    if (this.isAutoPlaying && !this.autoPlayInterval) {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // Aumentado a 5 segundos
    }
  }
  
  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resumeAutoPlay() {
    if (this.isAutoPlaying && !this.autoPlayInterval) {
      this.startAutoPlay();
    }
  }
}

// Inicialización mejorada
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes
  const cleanupParticles = initParticles();
  const cleanupThreeJS = initThreeJS();
  setupSmoothScroll();
  setupMobileMenu();
  setupIntersectionObservers();
  setupTypewriterEffect();
  setupCustomCursor();
  updateCurrentYear();
  
  // Inicializar carrusel
  new AutoCarousel();
  
  // Cleanup en caso de que sea necesario
  window.addEventListener('beforeunload', () => {
    if (cleanupParticles) cleanupParticles();
    if (cleanupThreeJS) cleanupThreeJS();
  });
});

// Manejar redimensionamiento con debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recargar elementos sensibles al tamaño si es necesario
  }, CONFIG.animations.resizeDebounce);
});
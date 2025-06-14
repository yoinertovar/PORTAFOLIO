// Configuración global
const CONFIG = {
  particles: {
    count: 100,
    color: 'rgba(0, 212, 255, 0.5)',
    maxSize: 3,
    connectionDistance: 120
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

// Inicializar partículas
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Clase de partícula
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * CONFIG.particles.maxSize + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
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
  
  // Función de animación
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar conexiones
    particles.forEach((p1, i) => {
      p1.update();
      p1.draw();
      
      // Conexiones
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
    
    requestAnimationFrame(animate);
  }
  
  // Manejar redimensionamiento
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // Iniciar
  window.addEventListener('resize', handleResize);
  animate();
}

// Inicializar Three.js
function initThreeJS() {
  const container = document.getElementById('hero-3d');
  if (!container || !window.THREE) return;
  
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
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Geometría
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
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
  
  // Animación
  function animate() {
    requestAnimationFrame(animate);
    
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;
    
    // Efecto de mouse
    torusKnot.rotation.x += mouseY * 0.0002;
    torusKnot.rotation.y += mouseX * 0.0002;
    
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
}

// Navegación suave
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Menú móvil
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  if (!toggle) return;

  const menu = document.createElement('div');
  menu.className = 'fixed top-16 left-0 w-full bg-gray-900/95 p-6 transform -translate-y-full transition-transform duration-300 z-40 hidden md:hidden';
  menu.setAttribute('aria-hidden', 'true');
  
  menu.innerHTML = `
    <nav class="flex flex-col space-y-4">
      <a href="#home" class="nav-item text-lg">Inicio</a>
      <a href="#about" class="nav-item text-lg">Sobre Mí</a>
      <a href="#skills" class="nav-item text-lg">Skills</a>
      <a href="#projects" class="nav-item text-lg">Proyectos</a>
      <a href="#contact" class="nav-item text-lg">Contacto</a>
    </nav>
  `;
  document.body.appendChild(menu);

  toggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      menu.classList.remove('hidden');
      menu.classList.remove('-translate-y-full');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      menu.classList.add('-translate-y-full');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar al hacer clic en enlace
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('-translate-y-full');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Observers para animaciones
function setupIntersectionObservers() {
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

// Efecto typewriter
function setupTypewriterEffect() {
  const elements = document.querySelectorAll('.typewriter');
  if (elements.length === 0) return;

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
    }
  }
  
  typing();
}

// Cursor personalizado
function setupCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'fixed w-4 h-4 bg-blue-400 rounded-full pointer-events-none z-50 transition-transform duration-100 hidden sm:block';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.8)';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Efectos hover
  const interactiveElements = [
    ...document.querySelectorAll('a'),
    ...document.querySelectorAll('button'),
    ...document.querySelectorAll('.cyber-btn')
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

// Manejo de formulario
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      
      // Simular envío (en producción usar fetch)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar notificación
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '¡Mensaje enviado con éxito!';
      document.body.appendChild(notification);
      
      // Limpiar formulario
      form.reset();
      
      // Ocultar notificación
      setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensaje';
    }
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Mostrar loader
  const loader = document.createElement('div');
  loader.className = 'fixed inset-0 bg-gray-900 flex items-center justify-center z-50 transition-opacity duration-1000';
  loader.innerHTML = `
    <div class="text-center">
      <div class="text-4xl sm:text-6xl font-bold neon-text font-['Orbitron'] mb-4">WEB 3.0</div>
      <div class="text-lg sm:text-xl text-blue-400 mb-6">Cargando el futuro...</div>
      <div class="w-48 sm:w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-progress"></div>
      </div>
    </div>
  `;
  document.body.appendChild(loader);

  // Inicializar componentes
  initParticles();
  initThreeJS();
  setupSmoothScroll();
  setupMobileMenu();
  setupIntersectionObservers();
  setupTypewriterEffect();
  setupCustomCursor();
  updateCurrentYear();
  setupContactForm();

  // Ocultar loader cuando todo esté listo
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 1000);
  }, 2000);
});

// Manejar redimensionamiento con debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Aquí podrías recargar elementos sensibles al tamaño
  }, CONFIG.animations.resizeDebounce);
});


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
                this.maxSlides = this.totalSlides - this.slidesPerView;
                this.autoPlayInterval = null;
                this.isAutoPlaying = true;
                
                this.init();
            }
            
            init() {
                this.createIndicators();
                this.bindEvents();
                this.startAutoPlay();
                this.updateCarousel();
                
                // Responsive handling
                window.addEventListener('resize', () => {
                    this.slidesPerView = this.getSlidesPerView();
                    this.maxSlides = this.totalSlides - this.slidesPerView;
                    this.updateCarousel();
                });
            }
            
            getSlidesPerView() {
                if (window.innerWidth >= 1024) return 3; // lg
                if (window.innerWidth >= 768) return 2;  // md
                return 1; // sm
            }
            
            createIndicators() {
                this.indicatorsContainer.innerHTML = '';
                const totalIndicators = this.maxSlides + 1;
                
                for (let i = 0; i < totalIndicators; i++) {
                    const indicator = document.createElement('div');
                    indicator.classList.add('indicator');
                    if (i === 0) indicator.classList.add('active');
                    
                    indicator.addEventListener('click', () => {
                        this.goToSlide(i);
                    });
                    
                    this.indicatorsContainer.appendChild(indicator);
                }
            }
            
            bindEvents() {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                
                // Pause on hover
                this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
                this.track.addEventListener('mouseleave', () => this.resumeAutoPlay());
                
                // Pause on card hover
                this.slides.forEach(slide => {
                    slide.addEventListener('mouseenter', () => this.pauseAutoPlay());
                    slide.addEventListener('mouseleave', () => this.resumeAutoPlay());
                });
            }
            
            updateCarousel() {
                const slideWidth = 100 / this.slidesPerView;
                const translateX = -(this.currentSlide * slideWidth);
                
                this.track.style.transform = `translateX(${translateX}%)`;
                this.updateIndicators();
            }
            
            updateIndicators() {
                const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === this.currentSlide);
                });
            }
            
            nextSlide() {
                if (this.currentSlide < this.maxSlides) {
                    this.currentSlide++;
                } else {
                    this.currentSlide = 0;
                }
                this.updateCarousel();
            }
            
            prevSlide() {
                if (this.currentSlide > 0) {
                    this.currentSlide--;
                } else {
                    this.currentSlide = this.maxSlides;
                }
                this.updateCarousel();
            }
            
            goToSlide(index) {
                this.currentSlide = Math.max(0, Math.min(index, this.maxSlides));
                this.updateCarousel();
            }
            
            startAutoPlay() {
                if (this.isAutoPlaying) {
                    this.autoPlayInterval = setInterval(() => {
                        this.nextSlide();
                    }, 4000);
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
        
        // Initialize carousel when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new AutoCarousel();
        });
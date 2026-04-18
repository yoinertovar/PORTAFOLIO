import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProjectItem {
  title: string;
  summary: string;
  image: string;
  badge: string;
  repo: string;
  demo: string;
  tech: string[];
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosComponent implements AfterViewInit, OnDestroy {
  readonly featuredProject: ProjectItem = {
    title: 'Sistema de Inventario',
    summary:
      'Sistema web completo para gestión de inventario con autenticación, dashboard y reportes en tiempo real.',
    image: 'img/sistem.png',
    badge: 'Destacado',
    repo: 'https://github.com/yoinertovar/SISTEMAIVENTARIO.git',
    demo: 'https://softwok.netlify.app/login',
    tech: ['React', 'TailwindCSS', 'JavaScript'],
  };

  readonly projects: ProjectItem[] = [
    {
      title: 'Landing Page - SolPro 24/7',
      summary:
        'Página de servicios profesionales con diseño responsivo, secciones de servicios y formulario de contacto.',
      image: 'img/page 1.png',
      badge: 'Nuevo',
      repo: 'https://github.com/yoinertovar/SOLPRO24-7.git',
      demo: 'https://construcaa.netlify.app/',
      tech: ['HTML5', 'CSS3', 'TailwindCSS'],
    },
    {
      title: 'Sistema de Login',
      summary:
        'Interfaz de autenticación moderna con fondo oscuro, recuperación de contraseña y acceso con redes sociales.',
      image: 'img/LOGIN.png',
      badge: 'UI',
      repo: 'https://github.com/yoinertovar/LOGIN.git',
      demo: 'https://login30ydtn.netlify.app/',
      tech: ['HTML5', 'CSS3'],
    },
    {
      title: 'Landing Page - Servicios Holísticos',
      summary:
        'Landing page estática para servicios holísticos con diseño responsivo y navegación por secciones.',
      image: 'img/LANDING2.png',
      badge: 'Landing',
      repo: 'https://github.com/yoinertovar/LANDINGPAGE2.git',
      demo: 'https://landinpage2.netlify.app/',
      tech: ['JavaScript', 'HTML5', 'CSS3'],
    },
    {
      title: 'Portafolio 3.0',
      summary:
        'Portafolio personal con animaciones, glassmorphism y una narrativa visual más inmersiva.',
      image: 'img/portafolio.png',
      badge: 'Portfolio',
      repo: 'https://github.com/yoinertovar/PORTAFOLIO.git',
      demo: '/',
      tech: ['Angular', 'IA', 'UI moderna'],
    },
  ];

  @ViewChild('carousel', { static: false }) carouselRef?: ElementRef<HTMLElement>;

  private rafId?: number;
  private isInteracting = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  get allProjects(): ProjectItem[] {
    return [this.featuredProject, ...this.projects];
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        this.ngZone.runOutsideAngular(() => {
            this.startLoop();
        });
    }
  }

  ngOnDestroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  onInteract(interacting: boolean) {
     this.isInteracting = interacting;
  }

  private startLoop() {
      const step = () => {
         const el = this.carouselRef?.nativeElement;
         if (el && !this.isInteracting) {
            el.scrollLeft += 0.8;
            // Assuming two identical sets of items rendered, maxScroll is half width
            const maxScroll = el.scrollWidth / 2;
            if (el.scrollLeft >= maxScroll) {
               el.scrollLeft -= maxScroll;
            }
         }
         this.rafId = requestAnimationFrame(step);
      };
      this.rafId = requestAnimationFrame(step);
  }
}

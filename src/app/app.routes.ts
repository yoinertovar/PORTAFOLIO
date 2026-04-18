import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Yoiner Tovar N. | Frontend Angular',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'sobre-mi',
    title: 'Sobre mí | Yoiner Tovar N.',
    loadComponent: () =>
      import('./pages/sobre-mi/sobre-mi.component').then((m) => m.SobreMiComponent),
  },
  {
    path: 'proyectos',
    title: 'Proyectos | Yoiner Tovar N.',
    loadComponent: () =>
      import('./pages/proyectos/proyectos.component').then((m) => m.ProyectosComponent),
  },
  {
    path: 'skills',
    title: 'Skills | Yoiner Tovar N.',
    loadComponent: () =>
      import('./pages/skills/skills.component').then((m) => m.SkillsComponent),
  },
  {
    path: 'estudios',
    title: 'Estudios | Yoiner Tovar N.',
    loadComponent: () =>
      import('./pages/estudios/estudios.component').then((m) => m.EstudiosComponent),
  },
  {
    path: 'ia',
    title: 'IA | Yoiner Tovar N.',
    loadComponent: () =>
      import('./pages/ia/ia.component').then((m) => m.IaComponent),
  },
  {
    path: 'contacto',
    title: 'Contacto | Yoiner Tovar N.',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  { path: '**', redirectTo: '' },
];

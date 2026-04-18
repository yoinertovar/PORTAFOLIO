import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';

type TechCategory = 'all' | 'frontend' | 'ui' | 'backend' | 'tools';
type TechIconKind = 'img' | 'fa';
type OrbitCategory = Exclude<TechCategory, 'all'>;

interface TechCategoryOption {
  key: TechCategory;
  label: string;
}

interface TechItem {
  name: string;
  slug: string;
  category: Exclude<TechCategory, 'all'>;
  iconKind: TechIconKind;
  icon: string;
  accent: string;
}

interface OrbitItem extends TechItem {
  angle: number;
}

interface OrbitShell {
  category: OrbitCategory;
  label: string;
  radius: string;
  duration: string;
  reverse: boolean;
  tilt: string;
  squash: string;
  items: OrbitItem[];
}

@Component({
  selector: 'app-tech-orbit',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tech-orbit.component.html',
  styleUrl: './tech-orbit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechOrbitComponent {
  @HostBinding('class.is-paused') orbitPaused = false;

  readonly categories: TechCategoryOption[] = [
    { key: 'all', label: 'Todo' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'ui', label: 'UI' },
    { key: 'backend', label: 'Backend' },
    { key: 'tools', label: 'Tools' },
  ];

  private readonly techPool: TechItem[] = [
    {
      name: 'Angular',
      slug: 'angular',
      category: 'frontend',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg',
      accent: '#DD0031',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'frontend',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      accent: '#3178C6',
    },
    {
      name: 'React',
      slug: 'react',
      category: 'frontend',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      accent: '#61DAFB',
    },
    {
      name: 'JavaScript',
      slug: 'javascript',
      category: 'frontend',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      accent: '#F7DF1E',
    },
    {
      name: 'HTML5',
      slug: 'html',
      category: 'frontend',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      accent: '#E34F26',
    },
    {
      name: 'CSS3',
      slug: 'css',
      category: 'frontend',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      accent: '#1572B6',
    },
    {
      name: 'Tailwind',
      slug: 'tailwind',
      category: 'ui',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      accent: '#06B6D4',
    },
    {
      name: 'Bootstrap',
      slug: 'bootstrap',
      category: 'ui',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      accent: '#7952B3',
    },
    {
      name: 'Figma',
      slug: 'figma',
      category: 'ui',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      accent: '#A259FF',
    },
    {
      name: 'UI/UX',
      slug: 'ui-ux',
      category: 'ui',
      iconKind: 'fa',
      icon: 'fa-solid fa-pen-ruler',
      accent: '#F59E0B',
    },
    {
      name: 'Git',
      slug: 'git',
      category: 'tools',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      accent: '#F05032',
    },
    {
      name: 'GitHub',
      slug: 'github',
      category: 'tools',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      accent: '#E5E7EB',
    },
    {
      name: 'Jira',
      slug: 'jira',
      category: 'tools',
      iconKind: 'img',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
      accent: '#2684FF',
    },
    {
      name: 'Microsoft Excel',
      slug: 'excel',
      category: 'tools',
      iconKind: 'fa',
      icon: 'fa-solid fa-file-excel',
      accent: '#22C55E',
    },
    {
      name: 'SQL',
      slug: 'sql',
      category: 'backend',
      iconKind: 'fa',
      icon: 'fa-solid fa-database',
      accent: '#38BDF8',
    },
    {
      name: 'Azure DevOps',
      slug: 'azure-devops',
      category: 'backend',
      iconKind: 'fa',
      icon: 'fa-solid fa-diagram-project',
      accent: '#0078D4',
    },
  ];

  private readonly shellConfigs: Array<Omit<OrbitShell, 'items'>> = [
    {
      category: 'frontend',
      label: 'Frontend',
      radius: 'clamp(16rem, 18vw, 18rem)',
      duration: '36s',
      reverse: false,
      tilt: '-20deg',
      squash: '0.66',
    },
    {
      category: 'ui',
      label: 'UI',
      radius: 'clamp(17.75rem, 20vw, 20rem)',
      duration: '42s',
      reverse: true,
      tilt: '34deg',
      squash: '0.58',
    },
    {
      category: 'backend',
      label: 'Backend',
      radius: 'clamp(19rem, 22vw, 22rem)',
      duration: '48s',
      reverse: false,
      tilt: '-58deg',
      squash: '0.63',
    },
    {
      category: 'tools',
      label: 'Tools',
      radius: 'clamp(20.5rem, 24vw, 23.5rem)',
      duration: '54s',
      reverse: true,
      tilt: '68deg',
      squash: '0.55',
    },
  ];

  activeCategory: TechCategory = 'all';
  orbitShells: OrbitShell[] = [];

  constructor() {
    this.updateOrbitShells();
  }

  selectCategory(category: TechCategory): void {
    if (this.activeCategory === category) {
      return;
    }

    this.activeCategory = category;
    this.updateOrbitShells();
  }

  pauseOrbit(): void {
    this.orbitPaused = true;
  }

  resumeOrbit(): void {
    this.orbitPaused = false;
  }

  trackBySlug(_: number, tech: OrbitItem): string {
    return tech.slug;
  }

  trackByCategory(_: number, category: TechCategoryOption): TechCategory {
    return category.key;
  }

  trackByShell(_: number, shell: OrbitShell): OrbitCategory {
    return shell.category;
  }

  private updateOrbitShells(): void {
    const visibleShells = this.shellConfigs.map((config) => {
      const selection =
        this.activeCategory === 'all'
          ? this.techPool.filter((tech) => tech.category === config.category)
          : this.activeCategory === config.category
            ? this.techPool.filter((tech) => tech.category === config.category)
            : [];

      const count = Math.max(selection.length, 1);
      const angleStep = 360 / count;

      return {
        ...config,
        items: selection.map((tech, index) => ({
          ...tech,
          angle: -90 + angleStep * index,
        })),
      } satisfies OrbitShell;
    });

    this.orbitShells = visibleShells;
  }
}

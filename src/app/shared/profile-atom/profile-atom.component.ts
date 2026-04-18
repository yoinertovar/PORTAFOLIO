import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type TechIconKind = 'img' | 'fa';
type OrbitLayer = 'back' | 'front';

interface AtomSkill {
  name: string;
  slug: string;
  iconKind: TechIconKind;
  icon: string;
  accent: string;
  importance?: number;
}

interface OrbitTemplate {
  id: string;
  layer: OrbitLayer;
  accent: string;
  radiusScale: number;
  squash: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  speed: number;
  phase: number;
  wobbleAmplitude: number;
  wobbleSpeed: number;
  parallax: number;
  opacity: number;
}

interface ElectronViewModel extends AtomSkill {
  phaseOffset: number;
  seed: number;
  sizeBoost: number;
}

interface OrbitViewModel extends OrbitTemplate {
  radiusPx: number;
  diameterPx: number;
  spin: number;
  parallaxX: number;
  parallaxY: number;
  cosX: number;
  sinX: number;
  cosY: number;
  sinY: number;
  cosZ: number;
  sinZ: number;
  electrons: ElectronViewModel[];
}

type ParticleLayer = 'back' | 'front';

interface ShootingStar {
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  length: number;
  width: number;
  ttl: number;
  startedAt: number;
  curveAmplitude: number;
  curveSpeed: number;
  curvePhase: number;
  alpha: number;
  glow: number;
  color: string;
  layer: ParticleLayer;
}

interface SceneBounds {
  width: number;
  height: number;
  min: number;
  centerX: number;
  centerY: number;
  dpr: number;
}

const TAU = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;

const DEFAULT_SKILLS: AtomSkill[] = [
  { name: 'Angular', slug: 'angular', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg', accent: '#DD0031', importance: 1.12 },
  { name: 'HTML5', slug: 'html', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', accent: '#E34F26', importance: 1.03 },
  { name: 'Figma', slug: 'figma', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', accent: '#A259FF', importance: 1.02 },
  { name: 'Jira', slug: 'jira', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg', accent: '#2684FF', importance: 1.0 },
  { name: 'React', slug: 'react', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', accent: '#61DAFB', importance: 1.12 },
  { name: 'CSS3', slug: 'css', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', accent: '#1572B6', importance: 1.02 },
  { name: 'UI/UX', slug: 'ui-ux', iconKind: 'fa', icon: 'fa-solid fa-pen-ruler', accent: '#F59E0B', importance: 1.08 },
  { name: 'Excel', slug: 'excel', iconKind: 'fa', icon: 'fa-solid fa-file-excel', accent: '#22C55E', importance: 1.0 },
  { name: 'TypeScript', slug: 'typescript', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', accent: '#3178C6', importance: 1.1 },
  { name: 'Tailwind', slug: 'tailwind', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', accent: '#06B6D4', importance: 1.02 },
  { name: 'Git', slug: 'git', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', accent: '#F05032', importance: 1.0 },
  { name: 'SQL', slug: 'sql', iconKind: 'fa', icon: 'fa-solid fa-database', accent: '#38BDF8', importance: 1.0 },
  { name: 'JavaScript', slug: 'javascript', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', accent: '#F7DF1E', importance: 1.05 },
  { name: 'Bootstrap', slug: 'bootstrap', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', accent: '#7952B3', importance: 1.0 },
  { name: 'GitHub', slug: 'github', iconKind: 'img', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', accent: '#E5E7EB', importance: 1.0 },
  { name: 'IA aplicada', slug: 'ia-aplicada', iconKind: 'fa', icon: 'fa-solid fa-brain', accent: '#A855F7', importance: 1.12 },
];

const ORBIT_TEMPLATES: OrbitTemplate[] = [
  {
    id: 'orbit-1',
    layer: 'front',
    accent: '#7C3AED',
    radiusScale: 0.38,
    squash: 1,
    tiltX: 90,
    tiltY: 0,
    tiltZ: 0,
    speed: 0.04,
    phase: 0,
    wobbleAmplitude: 0,
    wobbleSpeed: 0,
    parallax: 0.03,
    opacity: 0,
  }
];

@Component({
  selector: 'app-profile-atom',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-atom.component.html',
  styleUrl: './profile-atom.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAtomComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() orbitCount = 4;
  @Input() particleCount = 18;
  @Input() speedMultiplier = 1;
  @Input() orbitScale = 1;
  @Input() parallaxStrength = 1;

  @ViewChild('trailCanvas', { static: false }) private readonly trailCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChildren('orbitNode', { read: ElementRef }) private orbitNodeRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('electronNode', { read: ElementRef }) private electronNodeRefs!: QueryList<ElementRef<HTMLElement>>;

  readonly orbitViewModels: OrbitViewModel[] = this.createOrbitViewModels(this.orbitCount);

  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private readonly rootRef = inject(ElementRef<HTMLElement>);
  private orbitNodes: HTMLElement[] = [];
  private electronNodes: HTMLElement[] = [];
  private trailsCtx: CanvasRenderingContext2D | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private sceneBounds: SceneBounds = { width: 0, height: 0, min: 0, centerX: 0, centerY: 0, dpr: 1 };
  private particles: ShootingStar[] = [];
  private nextParticleAt = 0;
  private frameHandle = 0;
  private viewReady = false;
  private pointerTarget = { x: 0.5, y: 0.5 };
  private pointer = { x: 0.5, y: 0.5 };
  private readonly motionEnabled = typeof window !== 'undefined' ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches : true;

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (!this.viewReady) {
      return;
    }

    const bounds = this.rootRef.nativeElement.getBoundingClientRect();
    if (!bounds.width || !bounds.height) {
      return;
    }

    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      this.pointerTarget.x = 0.5;
      this.pointerTarget.y = 0.5;
      return;
    }

    this.pointerTarget.x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    this.pointerTarget.y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
  };

  private readonly animate = (timestamp: number): void => {
    if (!this.viewReady || !this.sceneBounds.width || !this.sceneBounds.height) {
      this.frameHandle = requestAnimationFrame(this.animate);
      return;
    }

    const dt = this.lastTimestamp > 0 ? timestamp - this.lastTimestamp : 16;
    this.lastTimestamp = timestamp;

    const pointerEase = clamp(dt / 180, 0.04, 0.12);
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * pointerEase;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * pointerEase;

    this.renderOrbits(timestamp / 1000);

    this.frameHandle = requestAnimationFrame(this.animate);
  };

  private lastTimestamp = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orbitCount']) {
      const nextCount = clampInt(Math.round(this.orbitCount), 3, ORBIT_TEMPLATES.length);
      this.replaceOrbitViewModels(nextCount);
    }

    if (this.viewReady && (changes['orbitCount'] || changes['orbitScale'])) {
      queueMicrotask(() => {
        this.syncDomCache();
        this.resizeScene();
      });
    }
  }

  ngAfterViewInit(): void {
    this.syncDomCache();
    this.viewReady = true;

    this.zone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
      }

      this.setupResizeObserver();
      this.resizeScene();

      if (this.motionEnabled) {
        this.nextParticleAt = performance.now() + randomRange(450, 1300);
        this.frameHandle = requestAnimationFrame(this.animate);
      } else {
        this.renderOrbits(0);
      }
    });

    this.orbitNodeRefs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncDomCache();
      this.resizeScene();
    });

    this.electronNodeRefs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncDomCache();
      this.resizeScene();
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('resize', this.resizeScene);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
    }
  }

  trackByOrbit(_: number, orbit: OrbitViewModel): string {
    return orbit.id;
  }

  trackByElectron(_: number, electron: ElectronViewModel): string {
    return electron.slug;
  }

  private replaceOrbitViewModels(count: number): void {
    const nextViewModels = this.createOrbitViewModels(count);
    this.orbitViewModels.splice(0, this.orbitViewModels.length, ...nextViewModels);
  }

  private createOrbitViewModels(count: number): OrbitViewModel[] {
    const templates = ORBIT_TEMPLATES;
    const skills = DEFAULT_SKILLS;

    return templates.map((template, index) => {
      const electrons: ElectronViewModel[] = skills.map((skill, skillIndex) => ({
        ...skill,
        phaseOffset: (skillIndex / Math.max(1, skills.length)) * TAU,
        seed: 0,
        sizeBoost: skill.importance ?? 1,
      }));

      return {
        ...template,
        radiusPx: 0,
        diameterPx: 0,
        spin: template.phase,
        parallaxX: 0,
        parallaxY: 0,
        cosX: 0,
        sinX: 0,
        cosY: 0,
        sinY: 0,
        cosZ: 0,
        sinZ: 0,
        electrons,
      };
    });
  }

  private syncDomCache(): void {
    this.orbitNodes = this.orbitNodeRefs?.toArray().map((ref) => ref.nativeElement) ?? [];
    this.electronNodes = this.electronNodeRefs?.toArray().map((ref) => ref.nativeElement) ?? [];
  }

  private setupResizeObserver(): void {
    if (this.trailCanvasRef?.nativeElement) {
      this.trailsCtx = this.trailCanvasRef.nativeElement.getContext('2d');
    }

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', this.resizeScene);
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.resizeScene());
    this.resizeObserver.observe(this.rootRef.nativeElement);
  }

  private readonly resizeScene = (): void => {
    const rootRect = this.rootRef.nativeElement.getBoundingClientRect();
    if (!rootRect.width || !rootRect.height) {
      return;
    }

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    this.sceneBounds = {
      width: rootRect.width,
      height: rootRect.height,
      min: Math.min(rootRect.width, rootRect.height),
      centerX: rootRect.width / 2,
      centerY: rootRect.height / 2,
      dpr,
    };

    const canvas = this.trailCanvasRef?.nativeElement;
    const ctx = this.trailsCtx;
    if (canvas && ctx) {
      canvas.width = Math.round(rootRect.width * dpr);
      canvas.height = Math.round(rootRect.height * dpr);
      canvas.style.width = `${rootRect.width}px`;
      canvas.style.height = `${rootRect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const compactScale = rootRect.width < 700 ? 0.78 : rootRect.width < 980 ? 0.9 : 1;
    const baseBubbleSize = clamp(this.sceneBounds.min * 0.082, 52, 80);
    let electronIndex = 0;

    this.orbitViewModels.forEach((orbit, index) => {
      const orbitNode = this.orbitNodes[index];
      const radiusScale = orbit.radiusScale * this.orbitScale * compactScale;
      orbit.radiusPx = this.sceneBounds.min * radiusScale;
      orbit.diameterPx = orbit.radiusPx * 2;
      orbit.parallaxX = orbit.parallax * (rootRect.width < 640 ? 10 : 16);
      orbit.parallaxY = orbit.parallax * (rootRect.width < 640 ? 7 : 12);
      orbit.cosX = Math.cos(orbit.tiltX * DEG_TO_RAD);
      orbit.sinX = Math.sin(orbit.tiltX * DEG_TO_RAD);
      orbit.cosY = Math.cos(orbit.tiltY * DEG_TO_RAD);
      orbit.sinY = Math.sin(orbit.tiltY * DEG_TO_RAD);
      orbit.cosZ = Math.cos(orbit.tiltZ * DEG_TO_RAD);
      orbit.sinZ = Math.sin(orbit.tiltZ * DEG_TO_RAD);

      if (orbitNode) {
        orbitNode.style.setProperty('--orbit-diameter', `${orbit.diameterPx}px`);
        orbitNode.style.setProperty('--orbit-tilt-x', `${orbit.tiltX}deg`);
        orbitNode.style.setProperty('--orbit-tilt-y', `${orbit.tiltY}deg`);
        orbitNode.style.setProperty('--orbit-tilt-z', `${orbit.tiltZ}deg`);
        orbitNode.style.setProperty('--orbit-accent', orbit.accent);
        orbitNode.style.setProperty('--orbit-opacity', String(orbit.opacity));
        orbitNode.style.zIndex = orbit.layer === 'front' ? '3' : '2';
      }

      orbit.electrons.forEach((electron) => {
        const electronNode = this.electronNodes[electronIndex++];
        if (!electronNode) {
          return;
        }

        const size = baseBubbleSize * electron.sizeBoost * (orbit.layer === 'front' ? 1.05 : 0.94);
        electronNode.style.setProperty('--bubble-size', `${size}px`);
        electronNode.style.setProperty('--bubble-accent', electron.accent);
      });
    });
  };

  private renderOrbits(seconds: number): void {
    const width = this.sceneBounds.width;
    const height = this.sceneBounds.height;
    const centerX = this.sceneBounds.centerX;
    const centerY = this.sceneBounds.centerY;
    const perspective = Math.max(this.sceneBounds.min * 1.25, 380);
    let electronIndex = 0;

    this.orbitViewModels.forEach((orbit, orbitIndex) => {
      const orbitNode = this.orbitNodes[orbitIndex];
      if (!orbitNode) {
        return;
      }

      const wobble = Math.sin(seconds * orbit.wobbleSpeed + orbitIndex * 1.37) * orbit.wobbleAmplitude;
      const spin = orbit.phase + seconds * orbit.speed * this.speedMultiplier + wobble;
      orbit.spin = spin;

      const parallaxX = (this.pointer.x - 0.5) * orbit.parallaxX * this.parallaxStrength;
      const parallaxY = (this.pointer.y - 0.5) * orbit.parallaxY * this.parallaxStrength;
      orbitNode.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;
      orbitNode.style.setProperty('--orbit-spin', `${spin}rad`);

      orbit.electrons.forEach((electron) => {
        const bubbleNode = this.electronNodes[electronIndex++];
        if (!bubbleNode) {
          return;
        }

        const theta = spin + electron.phaseOffset;
        const localX = Math.cos(theta) * orbit.radiusPx;
        const localZ = Math.sin(theta) * orbit.radiusPx * orbit.squash;

        const y1 = -localZ * orbit.sinX;
        const z1 = localZ * orbit.cosX;
        const x2 = localX * orbit.cosY + z1 * orbit.sinY;
        const z2 = -localX * orbit.sinY + z1 * orbit.cosY;
        const x3 = x2 * orbit.cosZ - y1 * orbit.sinZ;
        const y3 = x2 * orbit.sinZ + y1 * orbit.cosZ;

        const depth = clamp(0.5 + z2 / Math.max(orbit.radiusPx * 1.5, 1), 0, 1);
        const perspectiveScale = perspective / (perspective + z2);
        const sizePulse = 1 + Math.sin(seconds * 2.2 + electron.seed) * 0.02;
        const scale = lerp(0.74, 1.18, depth) * perspectiveScale * sizePulse;
        const blur = lerp(1.45, 0.02, depth);
        const brightness = lerp(0.82, 1.18, depth);
        const bubbleX = centerX + x3 * perspectiveScale;
        const bubbleY = centerY + y3 * perspectiveScale;
        const opacity = lerp(0.48, 1, depth) * (orbit.layer === 'front' ? 1 : 0.92);

        bubbleNode.style.transform = `translate3d(${bubbleX}px, ${bubbleY}px, 0) translate(-50%, -50%) scale(${scale})`;
        bubbleNode.style.opacity = String(opacity);
        bubbleNode.style.setProperty('--bubble-blur', `${blur}px`);
        bubbleNode.style.setProperty('--bubble-brightness', brightness.toFixed(2));
        bubbleNode.style.setProperty('--bubble-saturation', '1.18');
        bubbleNode.style.setProperty('--bubble-accent', electron.accent);
        bubbleNode.style.zIndex = String(Math.round(100 + depth * 120 + orbitIndex * 4));
      });
    });

    this.drawCanvas(width, height, seconds);
  }

  private drawCanvas(width: number, height: number, seconds: number): void {
    const ctx = this.trailsCtx;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (this.motionEnabled) {
      this.spawnParticles(seconds * 1000);
    }

    const alive: ShootingStar[] = [];
    const backParticles: ShootingStar[] = [];
    const frontParticles: ShootingStar[] = [];

    for (const particle of this.particles) {
      const elapsed = (seconds * 1000 - particle.startedAt) / 1000;
      const progress = clamp(elapsed / particle.ttl, 0, 1);

      if (progress >= 1) {
        continue;
      }

      alive.push(particle);
      if (particle.layer === 'front') {
        frontParticles.push(particle);
      } else {
        backParticles.push(particle);
      }
    }

    this.particles = alive;
    this.renderParticleBatch(ctx, backParticles, seconds, false);
    this.renderParticleBatch(ctx, frontParticles, seconds, true);
    ctx.restore();
  }

  private renderParticleBatch(ctx: CanvasRenderingContext2D, particles: ShootingStar[], seconds: number, isFront: boolean): void {
    for (const particle of particles) {
      const elapsed = seconds - particle.startedAt / 1000;
      const progress = clamp(elapsed / particle.ttl, 0, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const curve = Math.sin(progress * Math.PI * particle.curveSpeed + particle.curvePhase) * particle.curveAmplitude;
      const speedScale = 1;
      const headX = particle.startX + particle.vx * elapsed * speedScale;
      const headY = particle.startY + particle.vy * elapsed * speedScale;
      const speed = Math.hypot(particle.vx, particle.vy) || 1;
      const nx = particle.vx / speed;
      const ny = particle.vy / speed;
      const perpX = -ny;
      const perpY = nx;
      const x = headX + perpX * curve;
      const y = headY + perpY * curve;
      const tailX = x - nx * particle.length;
      const tailY = y - ny * particle.length;
      const alpha = particle.alpha * (1 - ease) * (isFront ? 1 : 0.85);

      const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.35, hexToRgba(particle.color, 0));
      gradient.addColorStop(1, hexToRgba(particle.color, alpha));

      ctx.shadowBlur = particle.glow;
      ctx.shadowColor = particle.color;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = particle.width;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = hexToRgba(particle.color, alpha * 0.8);
      ctx.beginPath();
      ctx.arc(x, y, particle.width * 0.9, 0, TAU);
      ctx.fill();
    }
  }

  private spawnParticles(now: number): void {
    const budget = this.resolveParticleBudget();
    if (budget <= 0 || !this.sceneBounds.width || !this.sceneBounds.height) {
      return;
    }

    const spawnWaveChance = 0.28;
    while (now >= this.nextParticleAt && this.particles.length < budget) {
      this.particles.push(this.createParticle(now));
      this.nextParticleAt = now + randomRange(420, 1700) / clamp(this.speedMultiplier, 0.7, 1.6);

      if (Math.random() < spawnWaveChance && this.particles.length < budget) {
        this.particles.push(this.createParticle(now));
      }
    }
  }

  private createParticle(now: number): ShootingStar {
    const width = this.sceneBounds.width;
    const height = this.sceneBounds.height;
    const margin = Math.max(70, this.sceneBounds.min * 0.14);
    const lane = Math.floor(Math.random() * 4);
    const startPresets = [
      { x: -margin, y: randomRange(-margin * 0.25, height * 0.35), angle: randomRange(24, 39) },
      { x: -margin, y: randomRange(height * 0.62, height + margin * 0.25), angle: randomRange(-40, -22) },
      { x: width + margin, y: randomRange(-margin * 0.25, height * 0.38), angle: randomRange(140, 157) },
      { x: width + margin, y: randomRange(height * 0.58, height + margin * 0.25), angle: randomRange(-158, -140) },
    ];

    const start = startPresets[lane];
    const angle = start.angle * DEG_TO_RAD;
    const speed = randomRange(420, 780) * clamp(this.speedMultiplier, 0.75, 1.6);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const layer: ParticleLayer = Math.random() < 0.28 ? 'front' : 'back';

    return {
      startX: start.x,
      startY: start.y,
      vx,
      vy,
      length: randomRange(180, 340),
      width: randomRange(0.9, 1.8),
      ttl: randomRange(1.05, 1.7) + Math.hypot(width, height) / Math.max(speed, 1),
      startedAt: now,
      curveAmplitude: randomRange(10, 32) * (layer === 'front' ? 1.12 : 1),
      curveSpeed: randomRange(0.8, 1.7),
      curvePhase: randomRange(0, TAU),
      alpha: layer === 'front' ? randomRange(0.22, 0.34) : randomRange(0.16, 0.24),
      glow: randomRange(10, 24),
      color: layer === 'front' ? '#67E8F9' : '#A78BFA',
      layer,
    };
  }

  private resolveParticleBudget(): number {
    return clampInt(Math.round(this.particleCount), 0, 40);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampInt(value: number, min: number, max: number): number {
  return Math.round(clamp(value, min, max));
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

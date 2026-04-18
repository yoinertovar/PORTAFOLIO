import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orbit-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './orbit-card.component.html',
  styleUrl: './orbit-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrbitCardComponent {
  @Input({ required: true }) route!: string;

  @Input({ required: true }) label!: string;

  @Input({ required: true }) copy!: string;

  @Input({ required: true }) icon!: string;

  @Input() angle = 0;

  @Input() radius = 'clamp(24.5rem, 30vw, 25.5rem)';
}

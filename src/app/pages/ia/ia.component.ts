import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ia.component.html',
  styleUrl: './ia.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IaComponent {}

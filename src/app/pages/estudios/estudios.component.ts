import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-estudios',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './estudios.component.html',
  styleUrl: './estudios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstudiosComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactoComponent {}

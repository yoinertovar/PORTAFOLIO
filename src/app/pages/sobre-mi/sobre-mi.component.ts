import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreMiComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileAtomComponent } from '../../shared/profile-atom/profile-atom.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProfileAtomComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-landing-placeholder-page',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './landing-placeholder-page.component.html'
})
export class LandingPlaceholderPageComponent {
  private route = inject(ActivatedRoute);

  title = this.route.snapshot.data['title'] ?? 'Sección';
  description = this.route.snapshot.data['description'] ?? 'Página en construcción.';
  icon = this.route.snapshot.data['icon'] ?? '🛠️';
}

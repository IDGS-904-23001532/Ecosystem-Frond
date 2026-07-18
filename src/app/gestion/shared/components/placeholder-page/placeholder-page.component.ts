import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './placeholder-page.component.html'
})
export class PlaceholderPageComponent {
  private route = inject(ActivatedRoute);

  title = this.route.snapshot.data['title'] ?? 'Seccion';
  description = this.route.snapshot.data['description'] ?? 'Modulo en construccion.';
  icon = this.route.snapshot.data['icon'] ?? '🛠️';
}

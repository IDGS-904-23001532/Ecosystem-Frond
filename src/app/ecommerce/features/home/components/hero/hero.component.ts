import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  private router = inject(Router);

  navigateToCotizacion() {
    this.router.navigate(['/conocenos/cotizacion']);
  }
}
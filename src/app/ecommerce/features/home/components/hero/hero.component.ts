import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  private router = inject(Router);

  navigateToCalculadora() {
    this.router.navigate(['/calculadora-ahorro']);
  }
}
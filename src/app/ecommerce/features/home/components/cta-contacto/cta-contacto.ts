import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cta-contacto',
  standalone: true,
  imports: [],
  templateUrl: './cta-contacto.html'
})
export class CtaContactoComponent {
  constructor(private router: Router) {}

  navegarAContacto(): void {
    this.router.navigate(['/conocenos/contactar']);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';
import { CtaContactoComponent } from '../home/components/cta-contacto/cta-contacto';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent, CtaContactoComponent],
  templateUrl: './nosotros.html'
})
export class NosotrosComponent {
  scrollToFaq() {
    const faqElement = document.getElementById('faq');
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

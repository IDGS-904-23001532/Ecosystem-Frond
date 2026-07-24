import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { RouterModule } from '@angular/router';
import { CtaContactoComponent } from './components/cta-contacto/cta-contacto';

@Component({
  selector: 'app-home',
  standalone: true,
  // ¡Importante! Aquí inyectamos los componentes hijos
  imports: [CommonModule, TopBarComponent, HeroComponent, RouterModule, CtaContactoComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent { }
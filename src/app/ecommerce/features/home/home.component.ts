import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { CtaContactoComponent } from './components/cta-contacto/cta-contacto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopBarComponent, HeroComponent, CtaContactoComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
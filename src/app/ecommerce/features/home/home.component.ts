import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';
import { HeroComponent } from './components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  // ¡Importante! Aquí inyectamos los componentes hijos
  imports: [CommonModule, TopBarComponent, HeroComponent], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Toda la lógica pesada se movió a los componentes correspondientes
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-calculadora-ahorro',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent],
  templateUrl: './calculadora-ahorro.component.html'
})
export class CalculadoraAhorroComponent {
  consumoPromedio: string = '';
  estado: string = '';
  tarifa: string = '';
  demandaHorarioPunta: string = '';

  siguientePaso() {
    console.log('Siguiente paso clickeado');
  }
}

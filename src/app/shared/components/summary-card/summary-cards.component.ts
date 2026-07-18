import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz para definir la estructura de cada tarjeta
export interface SummaryCard {
  label: string;
  value: number | string;
  icon: string;
  iconClass: string; // Para aplicar estilos específicos como 'icon-pink' o 'icon-outline'
}

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-cards.component.html'
})
export class SummaryCardsComponent {
  // Arreglo de tarjetas que el componente padre inyectará
  @Input() cards: SummaryCard[] = [];
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '📈';
  @Input() trend: string = '';
  @Input() trendClass: 'positive' | 'negative' | 'neutral' = 'neutral';
}
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../../components/card/card.component';

interface MetricItem {
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendClass: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-dashboard-metrics',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dashboard-metrics.component.html',
  styleUrls: ['./dashboard-metrics.component.scss']
})
export class DashboardMetricsComponent {
  @Input() metrics: MetricItem[] = [];
}

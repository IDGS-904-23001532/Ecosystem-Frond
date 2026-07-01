import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardMetricsComponent } from './components/dashboard-metrics/dashboard-metrics.component';
import { DashboardEnergyChartComponent } from './components/dashboard-energy-chart/dashboard-energy-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    DashboardHeaderComponent,
    DashboardMetricsComponent,
    DashboardEnergyChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Panel de Control';
  subtitle = 'Monitoreo general de operaciones y rendimiento sustentable.';
  username = 'Karla Martinez';
  userInitials = 'KM';

  // Datos simulados para las tarjetas
  metrics = [
    { title: 'Prospectos Activos', value: '152', icon: '👥', trend: '+12% esta semana', trendClass: 'positive' as const },
    { title: 'Ventas Totales', value: '$12,500', icon: '💰', trend: '+8% vs mes anterior', trendClass: 'positive' as const },
    { title: 'Energía Generada', value: '5.8 MWh', icon: '☀️', trend: 'Rendimiento Óptimo', trendClass: 'positive' as const },
    { title: 'Cotizaciones Pendientes', value: '48', icon: '⏳', trend: '-3% respecto a ayer', trendClass: 'negative' as const }
  ];
}
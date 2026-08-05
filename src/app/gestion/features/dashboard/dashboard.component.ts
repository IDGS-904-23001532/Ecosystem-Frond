import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderTitleComponent } from '../../../shared/components/header-title/header-title.component';
import { DashboardMetricsComponent } from './components/dashboard-metrics/dashboard-metrics.component';
import { DashboardEnergyChartComponent } from './components/dashboard-energy-chart/dashboard-energy-chart.component';
import { DashboardService } from './dashboard.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderTitleComponent,
    DashboardMetricsComponent,
    DashboardEnergyChartComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  title = 'Panel de Control';
  subtitle = 'Monitoreo general de operaciones y rendimiento del negocio.';
  username = '';
  userInitials = '';

  isLoading = true;
  hasError = false;

  metrics: Array<{
    title: string;
    value: string;
    icon: string;
    trend: string;
    trendClass: 'positive' | 'negative' | 'neutral';
  }> = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Obtener datos del usuario desde el JWT (mismas claves que el sidebar)
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.username =
        userInfo.nombreCompleto
        || userInfo.unique_name
        || userInfo.given_name
        || userInfo.name
        || userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']
        || userInfo.sub
        || 'Usuario';

      const partes = this.username.trim().split(' ');
      this.userInitials = partes.length >= 2
        ? (partes[0][0] + partes[1][0]).toUpperCase()
        : partes[0].substring(0, 2).toUpperCase();
    }

    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = [
          {
            title: 'Prospectos Activos',
            value: data.prospectos.toString(),
            icon: 'group',
            trend: data.tendenciaProspectos,
            trendClass: data.prospectos > 0 ? 'positive' : 'neutral'
          },
          {
            title: 'Ventas Totales',
            value: `$${data.ventasTotales.toLocaleString('es-MX')}`,
            icon: 'account_balance',
            trend: data.tendenciaVentas,
            trendClass: data.ventasTotales > 0 ? 'positive' : 'neutral'
          },
          {
            title: 'Cotizaciones Pendientes',
            value: data.cotizacionesPendientes.toString(),
            icon: 'hourglass_bottom',
            trend: data.tendenciaCotizaciones,
            trendClass: data.cotizacionesPendientes > 0 ? 'negative' : 'positive'
          },
          {
            title: 'Gastos Totales',
            value: `$${data.gastosTotales.toLocaleString('es-MX')}`,
            icon: 'receipt_long',
            trend: data.tendenciaGastos,
            trendClass: 'neutral'
          }
        ];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando métricas del dashboard', err);
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
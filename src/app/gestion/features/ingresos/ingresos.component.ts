import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from '../../../shared/components/header-title/header-title.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TableColumn, TableComponent } from '../../../shared/components/table/table.component';
import { IngresosService } from '../../../core/services/ingresos.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderTitleComponent,
    SidebarComponent,
    TableComponent
  ],
  templateUrl: './ingresos.component.html'
})
export class IngresosComponent implements OnInit {
  title = 'Ingresos';
  subtitle = 'Monitoreo de ingresos, facturación y reportes financieros.';
  username = 'Karla Martinez';
  userInitials = 'KM';

  // Datos para resumen
  tarjetasIngresos: any[] = [
    { label: 'Total Ingresos', value: '$0.00', icon: 'account_balance_wallet', iconClass: 'text-emerald-600' },
    { label: 'Ingresos del Mes', value: '$0.00', icon: 'trending_up', iconClass: 'text-emerald-600' }
  ];

  // Datos para periodo
  fechaInicio: string = '';
  fechaFin: string = '';
  
  columnasIngresos: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto' }
  ];
  
  datosIngresos: any[] = [];
  isLoadingTabla: boolean = false;
  
  // Datos para grafica
  anioGrafica: number = new Date().getFullYear();
  mesesGrafica: any[] = [];
  
  constructor(private ingresosService: IngresosService, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    // Inicializar fechas: primer y último día del mes actual
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // YYYY-MM-DD format manually to avoid timezone issues
    const formatYMD = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };
    
    this.fechaInicio = formatYMD(firstDay);
    this.fechaFin = formatYMD(lastDay);
    
    this.cargarResumen();
    this.cargarPeriodo();
    this.cargarGrafica();
  }
  
  cargarResumen(): void {
    this.ingresosService.getResumen().subscribe({
      next: (data: any) => {
        this.tarjetasIngresos[0].value = `$${(data?.total || 0).toLocaleString()}`;
        this.tarjetasIngresos[1].value = `$${(data?.ingresosMes || 0).toLocaleString()}`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen', err);
      }
    });
  }
  
  cargarPeriodo(): void {
    if (!this.fechaInicio || !this.fechaFin) return;
    
    this.isLoadingTabla = true;
    this.ingresosService.getPeriodo(this.fechaInicio, this.fechaFin).subscribe({
      next: (data: any) => {
        const dataArray = Array.isArray(data) ? data : (data?.data || data?.items || data?.ingresos || []);
        this.datosIngresos = dataArray.map((item: any) => ({
          ...item,
          monto: item.monto != null ? `$${Number(item.monto).toLocaleString()}` : '$0.00'
        }));
        this.isLoadingTabla = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando periodo', err);
        this.isLoadingTabla = false;
        // Mock data in case endpoint is not ready yet to not leave it empty
        this.datosIngresos = [
          { id: 1, fecha: '2026-08-01', concepto: 'Venta de equipo solar', monto: '$1,500.00' },
          { id: 2, fecha: '2026-08-02', concepto: 'Servicio de mantenimiento', monto: '$350.00' }
        ];
        this.cdr.detectChanges();
      }
    });
  }
  
  cargarGrafica(): void {
    this.ingresosService.getGraficaAnual(this.anioGrafica).subscribe({
      next: (data: any) => {
        this.mesesGrafica = data?.meses || this.generarMesesPorDefecto();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando grafica', err);
        this.mesesGrafica = this.generarMesesPorDefecto();
        this.cdr.detectChanges();
      }
    });
  }
  
  generarMesesPorDefecto(): any[] {
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return nombresMeses.map(mes => ({
      nombre: mes,
      valor: 0,
      porcentaje: Math.floor(Math.random() * 70) + 20 
    }));
  }
  
  cambiarAnio(incremento: number): void {
    this.anioGrafica += incremento;
    this.cargarGrafica();
  }
}

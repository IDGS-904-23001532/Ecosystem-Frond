import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresosService } from '../../../../../core/services/ingresos.service';

interface MesGrafica {
  nombre: string;
  valor: number;
  porcentaje: number;
}

@Component({
  selector: 'app-dashboard-energy-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-energy-chart.component.html'
})
export class DashboardEnergyChartComponent implements OnInit {
  anioActual = new Date().getFullYear();
  meses: MesGrafica[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private ingresosService: IngresosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarGrafica();
  }

  cargarGrafica(): void {
    this.isLoading = true;
    this.hasError = false;

    this.ingresosService.getGraficaAnual(this.anioActual).subscribe({
      next: (data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          const maxVal = Math.max(...data.map((m: any) => Number(m.ingresos) || 0), 1);
          this.meses = data.map((m: any) => ({
            nombre: (m.nombreMes as string).substring(0, 3),
            valor: Number(m.ingresos) || 0,
            porcentaje: Math.max(Math.floor(((Number(m.ingresos) || 0) / maxVal) * 100), 2)
          }));
        } else {
          this.meses = this.mesesVacios();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.meses = this.mesesVacios();
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mesesVacios(): MesGrafica[] {
    const nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                     'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return nombres.map(nombre => ({ nombre, valor: 0, porcentaje: 2 }));
  }

  get mesConMayorIngreso(): number {
    return Math.max(...this.meses.map(m => m.valor));
  }

  formatearValor(valor: number): string {
    if (valor >= 1000000) return `$${(valor / 1000000).toFixed(1)}M`;
    if (valor >= 1000) return `$${(valor / 1000).toFixed(1)}k`;
    return `$${valor.toLocaleString('es-MX')}`;
  }
}

import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProspectoService } from '../../../core/services/prospecto';
import { CotizacionService } from '../../../core/services/cotizacion';
import { GastoService } from '../../../core/services/gasto';
import { IngresosService } from '../../../core/services/ingresos.service';

export interface DashboardMetrics {
  prospectos: number;
  ventasTotales: number;
  cotizacionesPendientes: number;
  gastosTotales: number;
  tendenciaProspectos: string;
  tendenciaVentas: string;
  tendenciaCotizaciones: string;
  tendenciaGastos: string;
}

/** Normaliza cualquier respuesta de la API a un array seguro */
function toArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.Datos)) return data.Datos;
  if (Array.isArray(data?.datos)) return data.datos;
  return [];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private prospectoService: ProspectoService,
    private cotizacionService: CotizacionService,
    private gastoService: GastoService,
    private ingresosService: IngresosService
  ) {}

  getMetrics(): Observable<DashboardMetrics> {
    // Cada llamada tiene su propio catchError que devuelve un valor por defecto
    // para que el forkJoin NUNCA se quede colgado
    const prospectos$ = this.prospectoService.listarTodosProspectos().pipe(
      map(d => toArray(d)),
      catchError(() => of([] as any[]))
    );

    const cotizaciones$ = this.cotizacionService.listarCotizaciones().pipe(
      map(d => toArray(d)),
      catchError(() => of([] as any[]))
    );

    const gastos$ = this.gastoService.listarGastos().pipe(
      map(d => toArray(d)),
      catchError(() => of([] as any[]))
    );

    const resumen$ = this.ingresosService.getResumen().pipe(
      catchError(() => of(null))
    );

    return forkJoin({
      prospectos: prospectos$,
      cotizaciones: cotizaciones$,
      gastos: gastos$,
      resumenIngresos: resumen$
    }).pipe(
      map(({ prospectos, cotizaciones, gastos, resumenIngresos }) => {

        // Prospectos pendientes (campo puede ser 'estatus' o 'estado')
        const prospectosActivos = prospectos.filter((p: any) => {
          const estado = (p.estatus || p.estado || '').toLowerCase();
          return estado === 'pendiente' || estado === '';
        }).length;

        // Total ventas desde resumen
        const ventasTotales = Number(resumenIngresos?.totalVentas) || 0;

        // Cotizaciones pendientes
        const cotizacionesPendientes = cotizaciones.filter((c: any) => {
          const estado = (c.estatus || c.estado || '').toLowerCase();
          return estado === 'pendiente' || estado === '';
        }).length;

        // Gastos: suma del campo 'total'
        const gastosTotales = gastos.reduce(
          (sum: number, g: any) => sum + (Number(g.total) || 0),
          0
        );

        // Tendencias basadas en el mes actual
        const mesActual = new Date().getMonth();

        const prospectosEsteMes = prospectos.filter((p: any) => {
          const f = p.fechaRegistro || p.fecha || null;
          return f && new Date(f).getMonth() === mesActual;
        }).length;

        const gastosEsteMes = gastos
          .filter((g: any) => {
            const f = g.fecha || null;
            return f && new Date(f).getMonth() === mesActual;
          })
          .reduce((sum: number, g: any) => sum + (Number(g.total) || 0), 0);

        return {
          prospectos: prospectosActivos,
          ventasTotales,
          cotizacionesPendientes,
          gastosTotales,
          tendenciaProspectos:
            prospectosEsteMes > 0
              ? `${prospectosEsteMes} registrado${prospectosEsteMes > 1 ? 's' : ''} este mes`
              : 'Sin nuevos este mes',
          tendenciaVentas:
            ventasTotales > 0 ? 'Ingresos acumulados' : 'Sin ventas registradas',
          tendenciaCotizaciones:
            cotizacionesPendientes > 0
              ? `${cotizacionesPendientes} por atender`
              : 'Todo al día',
          tendenciaGastos:
            gastosEsteMes > 0
              ? `$${gastosEsteMes.toLocaleString('es-MX')} este mes`
              : 'Sin gastos este mes'
        };
      })
    );
  }
}

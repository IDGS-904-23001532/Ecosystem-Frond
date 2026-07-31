import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { TableAction, TableColumn, TableComponent } from '../../../shared/components/table/table.component';
import { CotizacionService } from '../../../core/services/cotizacion';
import { ProspectoService } from '../../../core/services/prospecto';
import { NuevaCotizacionComponent } from './components/nueva-cotizacion/nueva-cotizacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderTitleComponent, ButtonComponent, TableComponent, NuevaCotizacionComponent],
  templateUrl: './cotizaciones.component.html'
})
export class CotizacionesComponent implements OnInit {
  title = 'Cotizaciones';
  subtitle = 'Generación de cotizaciones para clientes potenciales.';
  username = 'Karla Martinez';
  userInitials = 'KM';

  isCreating = false;
  isLoading = false;

  columnasCotizacion: TableColumn[] = [
    { key: 'folio', label: 'Folio' },
    { key: 'cliente', label: 'Cliente / Prospecto' },
    { key: 'fecha', label: 'Fecha / vigencia' },
    { key: 'monto', label: 'Monto total' },
    { key: 'estatus', label: 'Estatus' }
  ];

  selectedProspectoIdForNewQuote: number | null = null;
  selectedCotizacionIdForEdit: number | null = null;

  datosCotizacion: any[] = [];
  prospectos: any[] = [];

  constructor(
    private cotizacionService: CotizacionService,
    private prospectoService: ProspectoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProspectos();
  }

  cargarProspectos(): void {
    this.prospectoService.listarProspectos().subscribe({
      next: (data) => {
        this.prospectos = data;
        this.cargarCotizaciones();
      },
      error: (err) => {
        console.error('Error al cargar prospectos:', err);
        this.cargarCotizaciones();
      }
    });
  }

  cargarCotizaciones(): void {
    this.isLoading = true;
    this.cotizacionService.listarCotizaciones().subscribe({
      next: (data) => {
        this.datosCotizacion = data.map((c: any) => {
          const prospecto = this.prospectos.find(p => (p.idProspecto || p.id) === c.idProspecto);
          const clienteNombre = c.prospectoNombre || (prospecto ? `${prospecto.nombre} ${prospecto.apellido}` : `Prospecto #${c.idProspecto}`);
          return {
            ...c,
            folio: c.idCotizacion || c.id,
            cliente: clienteNombre,
            fecha: new Date(c.fechaEmision || c.fecha || Date.now()).toLocaleDateString(),
            monto: this.toCurrency(c.totalCotizado || c.total || 0),
            estatus: c.estatus || 'Pendiente'
          };
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  manejarAccion(evento: TableAction) {
    const id = evento.rowData.idCotizacion || evento.rowData.id;
    if (evento.actionName === 'accept') {
      this.aceptarCotizacionFlow(id);
    } else if (evento.actionName === 'reject') {
      this.rechazarCotizacionFlow(id);
    } else if (evento.actionName === 'delete') {
      this.eliminarCotizacionFlow(id);
    } else if (evento.actionName === 'edit') {
      this.selectedProspectoIdForNewQuote = evento.rowData.idProspecto;
      this.selectedCotizacionIdForEdit = id;
      this.isCreating = true;
    }
  }

  aceptarCotizacionFlow(idCotizacion: number): void {
    Swal.fire({
      title: 'Aceptar Cotización',
      html: `
        <p class="mb-4 text-sm text-slate-500 text-left">Ingrese la información de pago para registrar la venta y convertir el prospecto a cliente:</p>
        <div class="flex flex-col gap-3 text-left">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Método de Pago</label>
            <select id="swal-metodo-pago" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia Bancaria</option>
              <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Descripción / Notas de la venta</label>
            <textarea id="swal-descripcion" placeholder="Ej. Pago inicial del 50% para instalación de paneles" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 h-20 resize-none"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Aceptar y Generar Venta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      preConfirm: () => {
        const metodoPago = (document.getElementById('swal-metodo-pago') as HTMLSelectElement).value;
        const descripcion = (document.getElementById('swal-descripcion') as HTMLTextAreaElement).value;
        return { metodoPago, descripcion };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.cotizacionService.aceptarCotizacion(idCotizacion, result.value).subscribe({
          next: () => {
            Swal.fire('¡Aceptada!', 'La cotización fue aceptada. Se generó la venta y el prospecto fue promovido a cliente.', 'success');
            this.cargarCotizaciones();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo procesar la aceptación de la cotización.', 'error');
          }
        });
      }
    });
  }

  rechazarCotizacionFlow(idCotizacion: number): void {
    Swal.fire({
      title: '¿Rechazar Cotización?',
      text: 'Esta acción cancelará la cotización y cambiará el estado del prospecto a "Cancelado".',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Rechazar Cotización',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cotizacionService.rechazarCotizacion(idCotizacion).subscribe({
          next: () => {
            Swal.fire('Rechazada', 'La cotización fue rechazada y el prospecto se marcó como cancelado.', 'success');
            this.cargarCotizaciones();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo rechazar la cotización.', 'error');
          }
        });
      }
    });
  }

  eliminarCotizacionFlow(idCotizacion: number): void {
    Swal.fire({
      title: '¿Eliminar Cotización?',
      text: 'Esta acción eliminará de forma permanente el registro de la cotización.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cotizacionService.eliminarCotizacion(idCotizacion).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La cotización fue eliminada correctamente.', 'success');
            this.cargarCotizaciones();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar la cotización.', 'error');
          }
        });
      }
    });
  }

  toCurrency(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2
    }).format(valor);
  }
}

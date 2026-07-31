import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard } from "../../../shared/components/summary-card/summary-cards.component";
import { OrdenServicioService } from '../../../core/services/orden-servicio.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalOrdenServicioComponent } from './components/modal-orden-servicio/modal-orden-servicio.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orden-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, ButtonComponent, ModalOrdenServicioComponent],
  templateUrl: './orden-servicio.component.html'
})
export class OrdenServicioComponent implements OnInit {

  title: string = 'Órdenes de Servicio';
  subtitle: string = 'Gestión de órdenes de servicio.';
  username: string = 'Karla Martinez';
  userInitials: string = 'KM';
  isLoading: boolean = true;

  totalOrdenes: number = 0;
  ordenesPendientes: number = 0;

  tarjetasOrdenes: SummaryCard[] = [
    {
      label: 'Total Órdenes',
      value: this.totalOrdenes,
      icon: 'assignment',
      iconClass: 'icon-pink'
    },
    {
      label: 'Órdenes Pendientes',
      value: this.ordenesPendientes,
      icon: 'pending_actions',
      iconClass: 'icon-emerald'
    }
  ];

  terminoBusqueda: string = '';

  columnasOrdenes: TableColumn[] = [
    { key: 'idFormat', label: 'ID' },
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'fechaFormat', label: 'Fecha Programada' },
    { key: 'detalleManual', label: 'Detalle' },
    { key: 'estatusFormat', label: 'Estatus' }
  ];

  datosOrdenes: any[] = [];
  clientes: any[] = [];
  mostrarModal: boolean = false;

  constructor(
    private ordenServicioService: OrdenServicioService, 
    private authService: AuthService, 
    private cdr: ChangeDetectorRef
  ) {}

  get ordenesFiltradas(): any[] {
    if (!this.terminoBusqueda.trim()) return this.datosOrdenes;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.datosOrdenes.filter(o =>
      o.clienteNombre?.toLowerCase().includes(termino) ||
      o.detalleManual?.toLowerCase().includes(termino) ||
      o.estatusFormat?.toLowerCase().includes(termino)
    );
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.authService.listarClientes(false).subscribe({
      next: (data) => {
        this.clientes = data.map((c: any) => ({
          ...c,
          nombreCompleto: c.nombreCompleto || `${c.nombre || ''} ${c.apellido || ''}`.trim() || 'Sin Nombre'
        }));
        this.cargarOrdenes();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.cargarOrdenes();
      }
    });
  }

  cargarOrdenes(): void {
    this.isLoading = true;
    this.ordenServicioService.listarOrdenes().subscribe({
      next: (data) => {
        this.datosOrdenes = data.map(o => {
          const cli = this.clientes.find(c => c.idCliente === o.idCliente);
          const cliNombre = cli ? (cli.nombreCompleto || `${cli.nombre || ''} ${cli.apellido || ''}`.trim() || 'Desconocido') : 'Desconocido';
          return {
            ...o,
            idFormat: `#${o.id || o.idOrden || o.idOrdenServicio || o.Id || o.IdOrdenServicio || o.id_orden_servicio || ''}`,
            clienteNombre: cliNombre,
            fechaFormat: new Date(o.fechaProgramada).toLocaleString(),
            estatusFormat: o.estatus || 'Pendiente'
          };
        });
        
        this.totalOrdenes = data.length;
        this.ordenesPendientes = data.filter(o => o.estatus !== 'Completado').length;
        
        this.tarjetasOrdenes[0].value = this.totalOrdenes;
        this.tarjetasOrdenes[1].value = this.ordenesPendientes;
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregarOrden(): void {
    this.mostrarModal = true;
  }

  guardarOrden(datos: any): void {
    this.ordenServicioService.registrarOrden(datos).subscribe({
      next: () => {
        Swal.fire('¡Registrada!', 'Orden de servicio registrada correctamente.', 'success');
        this.cargarOrdenes();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar la orden de servicio.', 'error');
      }
    });
  }

  manejarAccion(evento: TableAction): void {
    if (evento.actionName === 'edit') {
       this.cambiarEstatus(evento.rowData);
    } else if (evento.actionName === 'delete') {
      Swal.fire({
        title: '¿Eliminar orden?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const id = evento.rowData.id || evento.rowData.idOrden || evento.rowData.idOrdenServicio || evento.rowData.Id || evento.rowData.IdOrdenServicio || evento.rowData.id_orden_servicio;
          if (!id) {
            console.error('No se pudo encontrar el ID en el objeto (Delete):', evento.rowData);
            Swal.fire('Error', 'No se encontró el ID de la orden.', 'error');
            return;
          }
          this.ordenServicioService.eliminarOrden(id).subscribe({
            next: () => {
              Swal.fire('¡Eliminada!', 'Orden de servicio eliminada correctamente.', 'success');
              this.cargarOrdenes();
            },
            error: () => {
              Swal.fire('Error', 'No se pudo eliminar la orden de servicio.', 'error');
            }
          });
        }
      });
    }
  }

  cambiarEstatus(orden: any): void {
     Swal.fire({
        title: 'Actualizar Estatus',
        input: 'select',
        inputOptions: {
           'Pendiente': 'Pendiente',
           'En Proceso': 'En Proceso',
           'Completado': 'Completado',
           'Cancelado': 'Cancelado'
        },
        inputValue: orden.estatusFormat || 'Pendiente',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
     }).then((result) => {
        if (result.isConfirmed && result.value) {
           const id = orden.id || orden.idOrden || orden.idOrdenServicio || orden.Id || orden.IdOrdenServicio || orden.id_orden_servicio;
           if (!id) {
             console.error('No se pudo encontrar el ID en el objeto (Update):', orden);
             Swal.fire('Error', 'No se encontró el ID de la orden.', 'error');
             return;
           }
           this.ordenServicioService.actualizarEstatus(id, result.value).subscribe({
              next: () => {
                 Swal.fire('¡Actualizado!', 'El estatus ha sido actualizado.', 'success');
                 this.cargarOrdenes();
              },
              error: () => {
                 Swal.fire('Error', 'No se pudo actualizar el estatus.', 'error');
              }
           });
        }
     });
  }
}

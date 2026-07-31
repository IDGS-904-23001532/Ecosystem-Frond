import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard } from "../../../shared/components/summary-card/summary-cards.component";
import { AuthService } from '../../../core/services/auth.service';
import { ModalClienteComponent } from './components/modal-cliente/modal-cliente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, ButtonComponent, ModalClienteComponent],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  title: string = 'Clientes';
  subtitle: string = 'Gestión de clientes y relaciones comerciales.';
  username: string = 'Karla Martinez';
  userInitials: string = 'KM';
  isLoading: boolean = true;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  totalClientes: number = 0;
  clientesActivos: number = 0;

  tarjetasClientes: SummaryCard[] = [
    { label: 'Total Clientes', value: 0, icon: 'group', iconClass: 'icon-pink' },
    { label: 'Clientes Activos', value: 0, icon: 'check_circle', iconClass: 'icon-outline' }
  ];

  terminoBusqueda: string = '';

  columnasClientes: TableColumn[] = [
    { key: 'idCliente', label: 'ID' },
    { key: 'nombreCompleto', label: 'Nombre Completo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'corporativo', label: 'Corporativo' },
    { key: 'direccionInstalacion', label: 'Localidad' }
  ];

  datosClientes: any[] = [];
  mostrarModalCliente: boolean = false;
  clienteEditar: any = null; // null = modo creación

  get clientesFiltrados(): any[] {
    if (!this.terminoBusqueda) return this.datosClientes;
    const term = this.terminoBusqueda.toLowerCase().trim();
    return this.datosClientes.filter(c =>
      c.idCliente?.toString().includes(term) ||
      c.nombreCompleto?.toLowerCase().includes(term) ||
      c.telefono?.toLowerCase().includes(term) ||
      c.corporativo?.toLowerCase().includes(term) ||
      c.direccionInstalacion?.toLowerCase().includes(term)
    );
  }

  cargarClientes(forceRefresh: boolean = false): void {
    this.isLoading = true;
    this.authService.listarClientes(forceRefresh).subscribe({
      next: (data) => {
        this.datosClientes = data.map((c: any) => ({
          ...c,
          nombreCompleto: c.nombreCompleto || `${c.nombre || ''} ${c.apellido || ''}`.trim() || 'Sin Nombre',
          direccionInstalacion: c.direccionInstalacion || c.localidad || 'Sin dirección'
        }));
        this.totalClientes = data.length;
        this.clientesActivos = data.length;
        this.tarjetasClientes[0].value = this.totalClientes;
        this.tarjetasClientes[1].value = this.clientesActivos;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregarCliente(): void {
    // El flujo correcto es: Prospecto → Cotización → Cliente
    // Redirigimos a la vista de Prospectos para registrar uno nuevo
    this.router.navigate(['/prospectos']);
  }

  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      this.clienteEditar = evento.rowData;
      this.mostrarModalCliente = true;
    } else if (evento.actionName === 'delete') {
      this.confirmarEliminacion(evento.rowData);
    }
  }

  confirmarEliminacion(cliente: any): void {
    Swal.fire({
      title: '¿Eliminar cliente?',
      html: `Se eliminará permanentemente a <b>${cliente.nombreCompleto}</b>. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        this.authService.eliminarCliente(cliente.idCliente).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El cliente fue eliminado correctamente.', 'success');
            this.cargarClientes(true);
          },
          error: (err) => {
            console.error('Error eliminando cliente:', err);
            Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
          }
        });
      }
    });
  }

  guardarCliente(datos: any): void {
    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    if (this.clienteEditar) {
      // Modo edición — PUT
      this.authService.actualizarCliente(this.clienteEditar.idCliente, datos).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Los datos del cliente fueron actualizados correctamente.', 'success');
          this.cargarClientes(true);
        },
        error: (err) => {
          console.error('Error actualizando cliente:', err);
          Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error');
        }
      });
    } else {
      // Modo creación — POST
      this.authService.registroCliente(datos).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Cliente registrado correctamente.', 'success');
          this.cargarClientes(true);
        },
        error: (err) => {
          console.error('Error registrando cliente:', err);
          Swal.fire('Error', 'No se pudo registrar al cliente.', 'error');
        }
      });
    }
  }
}

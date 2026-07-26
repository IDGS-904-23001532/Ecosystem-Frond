import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";
import { ProveedorService } from '../../../core/services/proveedor';
import { ModalProveedorComponent } from './components/modal-proveedor/modal-proveedor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent, ModalProveedorComponent],
  templateUrl: './proveedores.html'
})
export class ProveedoresComponent implements OnInit {

  title: string = 'Proveedores';
  subtitle: string = 'Gestión de proveedores y catálogo de suministros.';
  username: string = 'Karla Martinez';
  userInitials: string = 'KM';
  isLoading: boolean = true;

  totalProveedores: number = 0;

  tarjetasProveedores: SummaryCard[] = [
    {
      label: 'Total Proveedores',
      value: this.totalProveedores,
      icon: 'local_shipping',
      iconClass: 'icon-pink'
    }
  ];

  terminoBusqueda: string = '';

  columnasProveedores: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'informacion', label: 'Información' }
  ];

  datosProveedores: any[] = [];
  mostrarModal: boolean = false;
  proveedorEditar: any = null;

  constructor(private proveedorService: ProveedorService, private cdr: ChangeDetectorRef) {}

  get proveedoresFiltrados(): any[] {
    if (!this.terminoBusqueda.trim()) return this.datosProveedores;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.datosProveedores.filter(p =>
      p.nombre?.toLowerCase().includes(termino)
    );
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.isLoading = true;
    this.proveedorService.listarProveedores().subscribe({
      next: (data) => {
        this.datosProveedores = data;
        this.totalProveedores = data.length;
        this.tarjetasProveedores[0].value = this.totalProveedores;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregarProveedor(): void {
    this.proveedorEditar = null;
    this.mostrarModal = true;
  }

  guardarProveedor(datos: any): void {
    if (this.proveedorEditar) {
      this.proveedorService.actualizarProveedor(this.proveedorEditar.idProveedor, datos).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Proveedor actualizado correctamente.', 'success');
          this.cargarProveedores();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el proveedor.', 'error');
        }
      });
    } else {
      this.proveedorService.registrarProveedor(datos).subscribe({
        next: () => {
          Swal.fire('¡Registrado!', 'Proveedor registrado correctamente.', 'success');
          this.cargarProveedores();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el proveedor.', 'error');
        }
      });
    }
  }

  manejarAccion(evento: TableAction): void {
    if (evento.actionName === 'edit') {
      this.proveedorEditar = evento.rowData;
      this.mostrarModal = true;
    } else if (evento.actionName === 'delete') {
      Swal.fire({
        title: '¿Eliminar proveedor?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.proveedorService.eliminarProveedor(evento.rowData.idProveedor).subscribe({
            next: () => {
              Swal.fire('¡Eliminado!', 'Proveedor eliminado correctamente.', 'success');
              this.cargarProveedores();
            },
            error: () => {
              Swal.fire('Error', 'No se pudo eliminar el proveedor.', 'error');
            }
          });
        }
      });
    }
  }
}
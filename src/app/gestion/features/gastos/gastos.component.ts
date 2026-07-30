import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard } from "../../../shared/components/summary-card/summary-cards.component";
import { GastoService } from '../../../core/services/gasto';
import { ProveedorService } from '../../../core/services/proveedor';
import { ModalGastoComponent } from './components/modal-gasto/modal-gasto.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, ButtonComponent, ModalGastoComponent],
  templateUrl: './gastos.component.html'
})
export class GastosComponent implements OnInit {

  title: string = 'Gastos';
  subtitle: string = 'Gestión de gastos operativos.';
  username: string = 'Karla Martinez';
  userInitials: string = 'KM';
  isLoading: boolean = true;

  totalGastos: number = 0;
  montoTotalGastos: number = 0;

  tarjetasGastos: SummaryCard[] = [
    {
      label: 'Total Gastos',
      value: this.totalGastos,
      icon: 'receipt_long',
      iconClass: 'icon-pink'
    },
    {
      label: 'Monto Total',
      value: `$${this.montoTotalGastos.toFixed(2)}`,
      icon: 'attach_money',
      iconClass: 'icon-emerald'
    }
  ];

  terminoBusqueda: string = '';

  columnasGastos: TableColumn[] = [
    { key: 'concepto', label: 'Concepto' },
    { key: 'fechaFormat', label: 'Fecha' },
    { key: 'proveedorNombre', label: 'Proveedor' },
    { key: 'totalFormat', label: 'Total' }
  ];

  datosGastos: any[] = [];
  proveedores: any[] = [];
  mostrarModal: boolean = false;
  gastoEditar: any = null;

  constructor(
    private gastoService: GastoService, 
    private proveedorService: ProveedorService, 
    private cdr: ChangeDetectorRef
  ) {}

  get gastosFiltrados(): any[] {
    if (!this.terminoBusqueda.trim()) return this.datosGastos;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.datosGastos.filter(g =>
      g.concepto?.toLowerCase().includes(termino) ||
      g.proveedorNombre?.toLowerCase().includes(termino)
    );
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.listarProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cargarGastos();
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.cargarGastos();
      }
    });
  }

  cargarGastos(): void {
    this.isLoading = true;
    this.gastoService.listarGastos().subscribe({
      next: (data) => {
        this.datosGastos = data.map(g => {
          const prov = this.proveedores.find(p => p.idProveedor === g.idProveedor);
          return {
            ...g,
            proveedorNombre: prov ? prov.nombre : 'Desconocido',
            fechaFormat: new Date(g.fecha).toLocaleDateString(),
            totalFormat: `$${g.total?.toFixed(2)}`
          };
        });
        
        this.totalGastos = data.length;
        this.montoTotalGastos = data.reduce((sum, g) => sum + (g.total || 0), 0);
        
        this.tarjetasGastos[0].value = this.totalGastos;
        this.tarjetasGastos[1].value = `$${this.montoTotalGastos.toFixed(2)}`;
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar gastos:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  agregarGasto(): void {
    this.gastoEditar = null;
    this.mostrarModal = true;
  }

  guardarGasto(datos: any): void {
    if (this.gastoEditar) {
      const id = this.gastoEditar.idGasto || this.gastoEditar.id;
      this.gastoService.actualizarGasto(id, datos).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Gasto actualizado correctamente.', 'success');
          this.cargarGastos();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el gasto.', 'error');
        }
      });
    } else {
      this.gastoService.registrarGasto(datos).subscribe({
        next: () => {
          Swal.fire('¡Registrado!', 'Gasto registrado correctamente.', 'success');
          this.cargarGastos();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el gasto.', 'error');
        }
      });
    }
  }

  manejarAccion(evento: TableAction): void {
    if (evento.actionName === 'edit') {
      this.gastoEditar = evento.rowData;
      this.mostrarModal = true;
    } else if (evento.actionName === 'delete') {
      Swal.fire({
        title: '¿Eliminar gasto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const id = evento.rowData.idGasto || evento.rowData.id;
          this.gastoService.eliminarGasto(id).subscribe({
            next: () => {
              Swal.fire('¡Eliminado!', 'Gasto eliminado correctamente.', 'success');
              this.cargarGastos();
            },
            error: () => {
              Swal.fire('Error', 'No se pudo eliminar el gasto.', 'error');
            }
          });
        }
      });
    }
  }
}

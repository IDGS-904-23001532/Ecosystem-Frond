import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { VentaService, CrearVentaDto } from '../../../core/services/venta';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, ButtonComponent],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {
  title: string = 'Historial de Ventas';
  subtitle: string = 'Monitorea y confirma los pagos de tus ventas.';
  username: string = 'Karla Martinez';
  userInitials: string = 'KM';
  isLoading: boolean = true;

  ventas: any[] = [];
  clientes: any[] = [];

  searchQuery: string = '';
  filterStatus: string = 'todos';

  // Stats computed from loaded sales
  stats = {
    total: 0,
    montoTotal: 0,
    pendientes: 0,
    completadas: 0
  };

  // Modal control and form data
  isModalOpen: boolean = false;
  nuevaVenta = {
    idCliente: null as number | null,
    total: null as number | null,
    metodoPago: 'Transferencia',
    descripcion: ''
  };

  constructor(
    private ventaService: VentaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarClientes();
  }

  cargarVentas(): void {
    this.isLoading = true;
    this.ventaService.listarVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.calcularStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarClientes(): void {
    this.authService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  calcularStats(): void {
    const total = this.ventas.length;
    const montoTotal = this.ventas.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const pendientes = this.ventas.filter(v => v.estado === 'Pendiente').length;
    const completadas = this.ventas.filter(v => v.estado === 'Completo').length;

    this.stats = { total, montoTotal, pendientes, completadas };
  }

  get filteredVentas(): any[] {
    let result = this.ventas;

    if (this.filterStatus !== 'todos') {
      result = result.filter(v => v.estado === this.filterStatus);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(v => 
        v.idVenta.toString().includes(q) ||
        v.clienteNombre.toLowerCase().includes(q) ||
        (v.descripcion && v.descripcion.toLowerCase().includes(q))
      );
    }

    return result;
  }

  confirmarPago(id: number): void {
    Swal.fire({
      title: '¿Confirmar Pago?',
      text: 'Esta acción marcará la venta como completada / pagada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Completar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Procesando...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });
        
        this.ventaService.completarVenta(id).subscribe({
          next: () => {
            Swal.fire('¡Pagada!', 'La venta se ha marcado como completa exitosamente.', 'success');
            this.cargarVentas();
          },
          error: (err) => {
            console.error('Error al completar venta:', err);
            Swal.fire('Error', 'No se pudo completar el pago de la venta.', 'error');
          }
        });
      }
    });
  }

  eliminarVenta(id: number): void {
    Swal.fire({
      title: '¿Eliminar Venta?',
      text: 'Esta acción cancelará y eliminará de forma definitiva el registro de venta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Procesando...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        this.ventaService.eliminarVenta(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'El registro de venta se ha eliminado correctamente.', 'success');
            this.cargarVentas();
          },
          error: (err) => {
            console.error('Error al eliminar venta:', err);
            Swal.fire('Error', 'No se pudo eliminar el registro de venta.', 'error');
          }
        });
      }
    });
  }

  openModal(): void {
    this.nuevaVenta = {
      idCliente: null,
      total: null,
      metodoPago: 'Transferencia',
      descripcion: ''
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  guardarVenta(event: Event): void {
    event.preventDefault();
    if (!this.nuevaVenta.idCliente) {
      Swal.fire('Atención', 'Debe seleccionar un cliente.', 'warning');
      return;
    }
    if (!this.nuevaVenta.total || this.nuevaVenta.total <= 0) {
      Swal.fire('Atención', 'Debe ingresar un monto total válido.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Procesando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const dto: CrearVentaDto = {
      idCliente: Number(this.nuevaVenta.idCliente),
      total: Number(this.nuevaVenta.total),
      metodoPago: this.nuevaVenta.metodoPago,
      descripcion: this.nuevaVenta.descripcion || null
    };

    this.ventaService.crearVenta(dto).subscribe({
      next: () => {
        Swal.fire('¡Registrada!', 'La venta directa se ha registrado correctamente.', 'success');
        this.closeModal();
        this.cargarVentas();
      },
      error: (err) => {
        console.error('Error al guardar venta:', err);
        Swal.fire('Error', 'No se pudo registrar la venta directa.', 'error');
      }
    });
  }

  toCurrency(val: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val || 0);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

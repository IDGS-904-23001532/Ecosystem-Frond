import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";
import { AuthService } from '../../../core/services/auth.service';
import { ModalClienteComponent } from './components/modal-cliente/modal-cliente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent, ModalClienteComponent],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

    // Datos para el componente HeaderTitle
    title: string = 'Clientes';
    subtitle: string = 'Gestión de clientes y relaciones comerciales.';
    username: string = 'Karla Martinez';
    userInitials: string = 'KM';
    isLoading: boolean = true;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
      this.cargarClientes();
    }

  // Datos para el componente SummaryCards
  totalClientes: number = 0;
  clientesActivos: number = 0;

  // Configuración de las tarjetas
  tarjetasClientes: SummaryCard[] = [
    {
      label: 'Total Clientes',
      value: this.totalClientes,
      icon: 'group',
      iconClass: 'icon-pink'
    },
    {
      label: 'Clientes Activos',
      value: this.clientesActivos,
      icon: 'check_circle',
      iconClass: 'icon-outline'
    }
  ];

  // Variables para el filtro y búsqueda
  terminoBusqueda: string = '';
  filtroActual: string = 'todos';

  // Columnas de la tabla de clientes (según el GET listar-clientes)
  columnasClientes: TableColumn[] = [
    { key: 'idCliente', label: 'ID' },
    { key: 'nombreCompleto', label: 'Nombre Completo' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'direccionInstalacion', label: 'Dirección' }
  ];
  
  datosClientes: any[] = []; 
  mostrarModalCliente: boolean = false; 
  
  cargarClientes(forceRefresh: boolean = false): void {
    if (forceRefresh || this.datosClientes.length === 0) {
      this.isLoading = true;
    }

    this.authService.listarClientes(forceRefresh).subscribe({
      next: (data) => {
        this.datosClientes = data;
        this.totalClientes = data.length;
        this.clientesActivos = data.length;
        this.tarjetasClientes[0].value = this.totalClientes;
        this.tarjetasClientes[1].value = this.clientesActivos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.isLoading = false;
      }
    });
  }

  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando el cliente:', evento.rowData);
    }
  }

  agregarCliente(): void {
    this.mostrarModalCliente = true;
  }

  guardarNuevoCliente(datosCliente: any): void {
    Swal.fire({
      title: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    this.authService.registroCliente(datosCliente).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Cliente registrado correctamente.', 'success');
        this.cargarClientes(true); // Refresca la tabla y caché
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar al cliente.', 'error');
      }
    });
  }
}
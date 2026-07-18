
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {

    // Datos para el componente HeaderTitle
    title: string = 'Clientes';
    subtitle: string = 'Gestión de clientes y relaciones comerciales.';
    username: string = 'Karla Martinez';
    userInitials: string = 'KM';

    // Datos para el componente SummaryCards
  totalClientes: number = 24;
  clientesActivos: number = 10;

  // Configuración de las tarjetas
tarjetasClientes: SummaryCard[] = [
  {
    label: 'Total Clientes',
    value: this.totalClientes,
    icon: '👥',
    iconClass: 'icon-pink'
  },
  {
    label: 'Clientes Activos',
    value: this.clientesActivos,
    icon: '✔️',
    iconClass: 'icon-outline'
  }
];

  // Variables para el filtro y búsqueda
  terminoBusqueda: string = '';
  filtroActual: string = 'todos';

  // Columnas de la tabla de clientes
    columnasClientes: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'necesidad', label: 'Necesidad' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'nivelInteres', label: 'Nivel de Interés' },
    { key: 'estado', label: 'Estado' }
  ];
  
  // Si está vacío se mostrará tu mensaje. Si tiene datos, se pintarán automáticamente.
  datosClientes = []; 
  
  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando el cliente:', evento.rowData);
    }
  }

  agregarCliente(): void {
    console.log('Abriendo modal para agregar cliente...');
  }
}
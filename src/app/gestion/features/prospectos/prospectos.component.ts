
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";

@Component({
  selector: 'app-prospectos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent],
  templateUrl: './prospectos.component.html',
  styleUrls: ['./prospectos.component.scss']
})
export class ProspectosComponent {

    // Datos para el componente HeaderTitle
    title: string = 'Prospectos';
    subtitle: string = 'Gestión de prospectos y oportunidades de negocio.';
    username: string = 'Karla Martinez';
    userInitials: string = 'KM';

    // Datos para el componente SummaryCards
  totalProspectos: number = 24;
  prospectosActivos: number = 10;

  // Configuración de las tarjetas
tarjetasProspectos: SummaryCard[] = [
  {
    label: 'Total Prospectos',
    value: this.totalProspectos,
    icon: '👥',
    iconClass: 'icon-pink'
  },
  {
    label: 'Prospectos Activos',
    value: this.prospectosActivos,
    icon: '✔️',
    iconClass: 'icon-outline'
  }
];

  // Variables para el filtro y búsqueda
  terminoBusqueda: string = '';
  filtroActual: string = 'todos';

  // Columnas de la tabla de prospectos
    columnasProspectos: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'necesidad', label: 'Necesidad' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'nivelInteres', label: 'Nivel de Interés' },
    { key: 'estado', label: 'Estado' }
  ];
  
  // Si está vacío se mostrará tu mensaje. Si tiene datos, se pintarán automáticamente.
  datosProspectos = []; 
  
  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando el prospecto:', evento.rowData);
    }
  }

  agregarProspecto(): void {
    console.log('Abriendo modal para agregar prospecto...');
  }
}
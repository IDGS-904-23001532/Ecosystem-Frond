import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";
import { ProspectoService } from '../../../core/services/prospecto';

@Component({
  selector: 'app-prospectos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent],
  templateUrl: './prospectos.component.html'
})
export class ProspectosComponent implements OnInit {

  title: string = 'Prospectos';
  subtitle: string = 'Gestión de prospectos y oportunidades de negocio.';
  username: string = 'Karla Martinez';
  userInitials: string = 'KM';
  isLoading: boolean = true;

  totalProspectos: number = 0;
  prospectosActivos: number = 0;

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

  terminoBusqueda: string = '';
  filtroActual: string = 'todos';

  columnasProspectos: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'corporativo', label: 'Empresa' },
    { key: 'localidad', label: 'Localidad' },
    { key: 'estatus', label: 'Estado' }
  ];

  datosProspectos: any[] = [];

  constructor(private prospectoService: ProspectoService) {}

  ngOnInit(): void {
    this.cargarProspectos();
  }

  cargarProspectos(): void {
    this.isLoading = true;
    this.prospectoService.listarProspectos().subscribe({
      next: (data) => {
        this.datosProspectos = data;
        this.totalProspectos = data.length;
        this.prospectosActivos = data.filter((p: any) => p.estatus === 'Pendiente').length;
        this.tarjetasProspectos = [
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar prospectos:', err);
        this.isLoading = false;
      }
    });
  }

  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando el prospecto:', evento.rowData);
    }
  }

  agregarProspecto(): void {
    console.log('Abriendo modal para agregar prospecto...');
  }
}
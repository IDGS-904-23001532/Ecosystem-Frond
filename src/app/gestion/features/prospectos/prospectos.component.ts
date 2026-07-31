import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";
import { ProspectoService } from '../../../core/services/prospecto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prospectos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent],
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
    { label: 'Total Prospectos', value: 0, icon: 'group', iconClass: 'icon-pink' },
    { label: 'Prospectos Activos', value: 0, icon: 'check_circle', iconClass: 'icon-outline' }
  ];

  terminoBusqueda: string = '';

  columnasProspectos: TableColumn[] = [
    { key: 'idProspecto', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'corporativo', label: 'Empresa' },
    { key: 'localidad', label: 'Localidad' },
    { key: 'estatus', label: 'Estado' }
  ];

  datosProspectos: any[] = [];

  // Modal
  mostrarModal: boolean = false;
  prospectoForm!: FormGroup;

  constructor(
    private prospectoService: ProspectoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarProspectos();
    this.buildForm();
  }

  buildForm(): void {
    this.prospectoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      corporativo: [''],
      localidad: ['', Validators.required]
    });
  }

  get prospectosFiltrados(): any[] {
    if (!this.terminoBusqueda) return this.datosProspectos;
    const term = this.terminoBusqueda.toLowerCase().trim();
    return this.datosProspectos.filter(p =>
      p.nombre?.toLowerCase().includes(term) ||
      p.apellido?.toLowerCase().includes(term) ||
      p.telefono?.toLowerCase().includes(term) ||
      p.corporativo?.toLowerCase().includes(term) ||
      p.localidad?.toLowerCase().includes(term) ||
      p.estatus?.toLowerCase().includes(term)
    );
  }

  cargarProspectos(): void {
    this.isLoading = true;
    this.prospectoService.listarProspectos().subscribe({
      next: (data) => {
        this.datosProspectos = data;
        this.totalProspectos = data.length;
        this.prospectosActivos = data.filter((p: any) => p.estatus === 'Pendiente').length;
        this.tarjetasProspectos = [
          { label: 'Total Prospectos', value: this.totalProspectos, icon: 'group', iconClass: 'icon-pink' },
          { label: 'Prospectos Activos', value: this.prospectosActivos, icon: 'check_circle', iconClass: 'icon-outline' }
        ];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar prospectos:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando prospecto:', evento.rowData);
    }
  }

  agregarProspecto(): void {
    this.prospectoForm.reset();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.prospectoForm.reset();
  }

  guardarProspecto(): void {
    if (this.prospectoForm.invalid) {
      this.prospectoForm.markAllAsTouched();
      return;
    }

    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    this.prospectoService.registrarProspecto(this.prospectoForm.value).subscribe({
      next: () => {
        Swal.fire('¡Registrado!', 'El prospecto fue registrado exitosamente.', 'success');
        this.cerrarModal();
        this.cargarProspectos();
      },
      error: (err) => {
        console.error('Error registrando prospecto:', err);
        Swal.fire('Error', 'No se pudo registrar el prospecto.', 'error');
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";
import { ModalUsuarioComponent } from './components/modal-usuario/modal-usuario.component';
import { ModalPermisosComponent } from './components/modal-permisos/modal-permisos.component';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent, ModalUsuarioComponent, ModalPermisosComponent],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

    // Datos para el componente HeaderTitle
    title: string = 'Empleados';
    subtitle: string = 'Gestión de personal y accesos del sistema.';
    username: string = 'Karla Martinez';
    userInitials: string = 'KM';
    isLoading: boolean = true;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
      this.cargarEmpleados();
    }

  // Datos para el componente SummaryCards
  totalUsuarios: number = 0;
  usuariosActivos: number = 0;

  // Configuración de las tarjetas
  tarjetasUsuarios: SummaryCard[] = [
    {
      label: 'Total Empleados',
      value: this.totalUsuarios,
      icon: 'group',
      iconClass: 'icon-pink'
    },
    {
      label: 'Empleados Activos',
      value: this.usuariosActivos,
      icon: 'check_circle',
      iconClass: 'icon-outline'
    }
  ];

  // Variables para el filtro y búsqueda
  terminoBusqueda: string = '';
  filtroPorEstado: string = 'todos';
  filtroTipoUsuario: string = 'todos';

  // Variable para controlar la visibilidad del modal de usuario
  mostrarModalUsuario: boolean = false;
  mostrarModalPermisos: boolean = false;
  areaEmpleadoSeleccionada: string = '';

  // Método para abrir el modal de usuario
  agregarUsuario(): void {
    this.mostrarModalUsuario = true;
  }

  guardarNuevoUsuario(datosUsuario: any): void {
    Swal.fire({
      title: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    this.authService.registroEmpleado(datosUsuario).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Empleado registrado correctamente.', 'success');
        this.cargarEmpleados(true);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar al empleado.', 'error');
      }
    });
  }

// Metodo para filtrar por estado de usuario
filtrarPorEstado(): void {
  console.log('Filtrando por estado de usuario:', this.filtroPorEstado);
  // Aquí puedes agregar la lógica para filtrar los usuarios según el estado seleccionado
}

// Método para filtrar por tipo de usuario
filtrarPorTipo(): void {
  console.log('Filtrando por tipo de usuario:', this.filtroTipoUsuario);
  // Aquí puedes agregar la lógica para filtrar los usuarios según el tipo seleccionado
}

  // Columnas de la tabla de empleados
  columnasUsuarios: TableColumn[] = [
    { key: 'idEmpleado', label: 'ID' },
    { key: 'nombreCompleto', label: 'Nombre Completo' },
    { key: 'puesto', label: 'Puesto' },
    { key: 'fechaIngreso', label: 'Fecha de Ingreso' }
  ];
  
  datosUsuarios: any[] = []; 
  
  cargarEmpleados(forceRefresh: boolean = false): void {
    if (forceRefresh || this.datosUsuarios.length === 0) {
      this.isLoading = true;
    }
    
    this.authService.listarEmpleados(forceRefresh).subscribe({
      next: (data) => {
        // Formatear la fecha para que se vea bonita
        this.datosUsuarios = data.map(empleado => ({
          ...empleado,
          fechaIngreso: empleado.fechaIngreso ? new Date(empleado.fechaIngreso).toLocaleDateString() : 'N/A'
        }));
        
        this.totalUsuarios = data.length;
        this.usuariosActivos = data.length; // Asumimos activos
        this.tarjetasUsuarios[0].value = this.totalUsuarios;
        this.tarjetasUsuarios[1].value = this.usuariosActivos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando empleados', err);
        this.isLoading = false;
      }
    });
  }
  
  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando el usuario:', evento.rowData);
    }
  }

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { TableAction, TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { SummaryCard, SummaryCardsComponent } from "../../../shared/components/summary-card/summary-cards.component";
import { ModalUsuarioComponent } from './components/modal-usuario/modal-usuario.component';
import { ModalPermisosComponent } from './components/modal-permisos/modal-permisos.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderTitleComponent, SidebarComponent, TableComponent, SummaryCardsComponent, ButtonComponent, ModalUsuarioComponent, ModalPermisosComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {

    // Datos para el componente HeaderTitle
    title: string = 'Usuarios';
    subtitle: string = 'Gestión de usuarios y permisos.';
    username: string = 'Karla Martinez';
    userInitials: string = 'KM';

    // Datos para el componente SummaryCards
  totalUsuarios: number = 24;
  usuariosActivos: number = 10;

  // Configuración de las tarjetas
tarjetasUsuarios: SummaryCard[] = [
  {
    label: 'Total Usuarios',
    value: this.totalUsuarios,
    icon: '👥',
    iconClass: 'icon-pink'
  },
  {
    label: 'Usuarios Activos',
    value: this.usuariosActivos,
    icon: '✔️',
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
    console.log('Datos recibidos del formulario:', datosUsuario);
    // Aquí puedes agregar la lógica para guardar el nuevo usuario en tu sistema

    if(datosUsuario.rol === 'Empleado') {
      this.areaEmpleadoSeleccionada = datosUsuario.area;
      this.mostrarModalPermisos = true;
    } else {
      console.log('Usuario guardado sin permisos adicionales.');
  }
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

  // Columnas de la tabla de usuarios
    columnasUsuarios: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'necesidad', label: 'Necesidad' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'nivelInteres', label: 'Nivel de Interés' },
    { key: 'estado', label: 'Estado' }
  ];
  
  // Si está vacío se mostrará tu mensaje. Si tiene datos, se pintarán automáticamente.
  datosUsuarios = []; 
  
  manejarAccion(evento: TableAction) {
    if (evento.actionName === 'edit') {
      console.log('Editando el usuario:', evento.rowData);
    }
  }

}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-permisos',
  standalone: true,
  imports: [CommonModule],
  template: './modal-permisos.component.html',
  styleUrls: ['../modal-usuario/modal-usuario.component.scss'] // Reutilizamos estilos
})
export class ModalPermisosComponent {
  @Input() isVisible: boolean = false;
  @Input() areaEmpleado: string = '';
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }

  guardar() {
    console.log('Permisos guardados para el área:', this.areaEmpleado);
    this.cerrar();
  }
}
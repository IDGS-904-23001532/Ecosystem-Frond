import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-usuario.component.html'
})
export class ModalUsuarioComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() empleadoData: any = null; // <-- Recibe los datos del empleado a editar
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      puesto: ['', Validators.required]
    });
  }

  // Esto detecta cuando le pasas un empleado para editar y llena los campos
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleadoData'] && this.userForm) {
      if (this.empleadoData) {
        // Modo Edición: Llenar datos y quitar validación obligatoria de password
        this.userForm.patchValue({
          nombreCompleto: this.empleadoData.nombreCompleto,
          correo: '',
          puesto: this.empleadoData.puesto,
          password: '' 
        });
        // Quitamos la obligación de llenar correo y contraseña
        this.userForm.get('correo')?.clearValidators();
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('correo')?.updateValueAndValidity();
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        // Modo Creación: Resetear form y volver password obligatorio
        this.userForm.reset();
        this.userForm.get('password')?.setValidators([Validators.required]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    }
  }

  cerrar() {
    this.close.emit();
    this.userForm.reset();
  }

  guardar() {
    if (this.userForm.valid) {
      // Agregamos el ID si es que estamos editando para que el backend sepa a quién actualizar
      const formData = this.userForm.getRawValue();
      if (this.empleadoData?.idEmpleado) {
        formData.idEmpleado = this.empleadoData.idEmpleado;
      }
      
      this.save.emit(formData); 
      this.cerrar();
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
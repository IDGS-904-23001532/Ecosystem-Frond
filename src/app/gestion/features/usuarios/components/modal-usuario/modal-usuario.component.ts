import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './modal-usuario.component.html'
})
export class ModalUsuarioComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>(); // Emite los datos y el rol

  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const hoy = new Date().toISOString().split('T')[0]; // Fecha actual YYYY-MM-DD

    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      rol: ['cliente', Validators.required],
      // Campos de empleado (inicialmente sin validación estricta hasta que se seleccione el rol)
      usuario: [''],
      contrasena: [''],
      area: [''],
      fechaContratacion: [{ value: hoy, disabled: true }]
    });

    // Escuchar cambios en el rol para habilitar/deshabilitar validaciones
    this.userForm.get('rol')?.valueChanges.subscribe(rol => {
      const isEmpleado = rol === 'empleado';
      const controlesEmpleado = ['usuario', 'contrasena', 'area'];

      controlesEmpleado.forEach(ctrl => {
        const control = this.userForm.get(ctrl);
        if (isEmpleado) {
          control?.setValidators(Validators.required);
        } else {
          control?.clearValidators();
          control?.setValue(''); // Limpiar si cambia a cliente
        }
        control?.updateValueAndValidity();
      });
    });
  }

  cerrar() {
    this.close.emit();
    this.userForm.reset({ rol: 'cliente', fechaContratacion: new Date().toISOString().split('T')[0] });
  }

  guardar() {
    if (this.userForm.valid) {
      // getRawValue incluye campos deshabilitados como la fecha
      this.save.emit(this.userForm.getRawValue()); 
      this.cerrar();
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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

  cerrar() {
    this.close.emit();
    this.userForm.reset();
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
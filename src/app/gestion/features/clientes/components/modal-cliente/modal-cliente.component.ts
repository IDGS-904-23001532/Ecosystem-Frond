import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-cliente.component.html'
})
export class ModalClienteComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  clientForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      telefono: ['', Validators.required],
      direccionInstalacion: ['', Validators.required]
    });
  }

  cerrar() {
    this.close.emit();
    this.clientForm.reset();
  }

  guardar() {
    if (this.clientForm.valid) {
      this.save.emit(this.clientForm.value);
      this.cerrar();
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
}

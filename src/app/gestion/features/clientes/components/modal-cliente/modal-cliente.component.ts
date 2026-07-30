import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-cliente.component.html'
})
export class ModalClienteComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() clienteEditar: any = null;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteEditar'] && this.clienteEditar && this.clientForm) {
      this.clientForm.patchValue({
        nombreCompleto: this.clienteEditar.nombreCompleto || `${this.clienteEditar.nombre || ''} ${this.clienteEditar.apellido || ''}`.trim(),
        correo: this.clienteEditar.correo || '',
        password: '',
        telefono: this.clienteEditar.telefono || '',
        direccionInstalacion: this.clienteEditar.direccionInstalacion || this.clienteEditar.localidad || ''
      });
      this.clientForm.get('password')?.clearValidators();
      this.clientForm.get('password')?.updateValueAndValidity();
    }
    if (changes['isVisible'] && !this.isVisible) {
      this.clientForm?.reset();
      this.clientForm?.get('password')?.setValidators(Validators.required);
      this.clientForm?.get('password')?.updateValueAndValidity();
    }
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

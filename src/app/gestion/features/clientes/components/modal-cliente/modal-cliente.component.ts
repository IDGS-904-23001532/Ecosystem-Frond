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
  @Input() clienteEditar: any = null; // null = modo creación, objeto = modo edición
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  clientForm!: FormGroup;

  get isEditing(): boolean {
    return !!this.clienteEditar;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.buildForm();
      if (this.clienteEditar) {
        this.clientForm.patchValue({
          nombre: this.clienteEditar.nombre || '',
          apellido: this.clienteEditar.apellido || '',
          telefono: this.clienteEditar.telefono || '',
          localidad: this.clienteEditar.localidad || this.clienteEditar.direccionInstalacion || '',
          corporativo: this.clienteEditar.corporativo || ''
        });
      }
    }
  }

  buildForm(): void {
    this.clientForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      localidad: ['', Validators.required],
      corporativo: ['']
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

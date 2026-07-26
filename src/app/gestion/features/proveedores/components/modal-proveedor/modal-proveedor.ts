import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-proveedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-proveedor.html'
})
export class ModalProveedorComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() proveedorEditar: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  proveedorForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['', Validators.required],
      informacion: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedorEditar'] && this.proveedorEditar && this.proveedorForm) {
      this.proveedorForm.patchValue({
        nombre: this.proveedorEditar.nombre,
        contacto: this.proveedorEditar.contacto,
        informacion: this.proveedorEditar.informacion
      });
    }
    if (changes['isVisible'] && !this.isVisible) {
      this.proveedorForm?.reset();
    }
  }

  cerrar() {
    this.close.emit();
    this.proveedorForm.reset();
  }

  guardar() {
    if (this.proveedorForm.valid) {
      this.save.emit(this.proveedorForm.value);
      this.cerrar();
    } else {
      this.proveedorForm.markAllAsTouched();
    }
  }
}
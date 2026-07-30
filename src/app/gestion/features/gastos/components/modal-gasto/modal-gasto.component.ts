import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-gasto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-gasto.component.html'
})
export class ModalGastoComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() gastoEditar: any = null;
  @Input() proveedores: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  gastoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.gastoForm = this.fb.group({
      fecha: ['', Validators.required],
      idProveedor: [null, Validators.required],
      concepto: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gastoEditar'] && this.gastoEditar && this.gastoForm) {
      const fechaFormat = this.gastoEditar.fecha ? new Date(this.gastoEditar.fecha).toISOString().substring(0, 10) : '';
      this.gastoForm.patchValue({
        fecha: fechaFormat,
        idProveedor: this.gastoEditar.idProveedor,
        concepto: this.gastoEditar.concepto,
        total: this.gastoEditar.total
      });
    }
    if (changes['isVisible'] && !this.isVisible) {
      this.gastoForm?.reset();
    }
  }

  cerrar() {
    this.close.emit();
    this.gastoForm.reset();
  }

  guardar() {
    if (this.gastoForm.valid) {
      const formValue = this.gastoForm.value;
      const data = {
        ...formValue,
        fecha: new Date(formValue.fecha).toISOString(),
        idProveedor: Number(formValue.idProveedor)
      };
      this.save.emit(data);
      this.cerrar();
    } else {
      this.gastoForm.markAllAsTouched();
    }
  }
}

import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-orden-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-orden-servicio.component.html'
})
export class ModalOrdenServicioComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() clientes: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  ordenForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ordenForm = this.fb.group({
      idCliente: [null, Validators.required],
      fechaProgramada: ['', Validators.required],
      detalleManual: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && !this.isVisible) {
      this.ordenForm?.reset();
    }
  }

  cerrar() {
    this.close.emit();
    this.ordenForm.reset();
  }

  guardar() {
    if (this.ordenForm.valid) {
      const formValue = this.ordenForm.value;
      const data = {
        ...formValue,
        fechaProgramada: new Date(formValue.fechaProgramada).toISOString(),
        idCliente: Number(formValue.idCliente)
      };
      this.save.emit(data);
      this.cerrar();
    } else {
      this.ordenForm.markAllAsTouched();
    }
  }
}

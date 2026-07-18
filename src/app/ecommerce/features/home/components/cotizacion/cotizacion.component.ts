import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion.component.html'
})
export class CotizacionComponent implements OnInit {
  cotizacionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cotizacionForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  enviarMensaje(): void {
    if (this.cotizacionForm.valid) {
      console.log('Mensaje enviado:', this.cotizacionForm.value);
      this.cotizacionForm.reset();
    } else {
      this.cotizacionForm.markAllAsTouched();
    }
  }
}
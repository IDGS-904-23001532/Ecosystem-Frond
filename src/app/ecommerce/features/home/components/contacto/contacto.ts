import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProspectoService } from '../../../../../core/services/prospecto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
templateUrl: './contacto.html'
})
export class ContactoComponent {
  contactoForm: FormGroup;
  enviando = false;

  constructor(private fb: FormBuilder, private prospectoService: ProspectoService) {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      corporativo: [''],
      localidad: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.contactoForm.valid) {
      this.enviando = true;
      this.prospectoService.registrarProspecto(this.contactoForm.value).subscribe({
        next: () => {
          this.enviando = false;
          Swal.fire({
            title: '¡Mensaje enviado!',
            text: 'Nos pondremos en contacto contigo pronto.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#ffffff',
            iconColor: '#10b981'
          });
          this.contactoForm.reset();
        },
        error: () => {
          this.enviando = false;
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al enviar tu información. Intenta de nuevo.',
            icon: 'error',
            background: '#0f172a',
            color: '#ffffff',
            iconColor: '#ef4444'
          });
        }
      });
    } else {
      this.contactoForm.markAllAsTouched();
    }
  }
}
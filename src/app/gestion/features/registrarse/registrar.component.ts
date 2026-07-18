import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './registrar.component.html'
})
export class RegistrarComponent implements OnInit {
  registrarForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registrarForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],   
      direccionInstalacion: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.registrarForm.valid) {
      this.isLoading = true;
      const formValues = this.registrarForm.value;
      
      const payload = {
        correo: formValues.email,
        password: formValues.password,
        nombreCompleto: formValues.name,
        direccionInstalacion: formValues.direccionInstalacion,
        telefono: formValues.phone
      };

      Swal.fire({
        title: 'Registrando...',
        text: 'Estamos creando tu cuenta.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.authService.registroCliente(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          Swal.fire({
            title: '¡Cuenta creada!',
            text: 'Bienvenido a Ecosystem.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#ffffff',
            color: '#1e293b',
            iconColor: '#10b981',
            customClass: { popup: 'rounded-2xl shadow-xl' }
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudo crear la cuenta. Verifica tus datos o intenta más tarde.',
            icon: 'error',
            confirmButtonColor: '#10b981',
            customClass: { popup: 'rounded-2xl shadow-xl' }
          });
        }
      });
    } else {
      this.registrarForm.markAllAsTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
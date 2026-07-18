import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TopBarComponent } from "../../../ecommerce/shared/components/topbar/topbar.component";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Autenticando usuario:', this.loginForm.value);
      Swal.fire({
        title: '¡Acceso concedido!',
        text: 'Preparando tu panel de control...',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#1e293b',
        iconColor: '#10b981',
        customClass: {
          popup: 'rounded-2xl shadow-xl'
        }
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
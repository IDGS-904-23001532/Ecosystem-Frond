import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Aquí va tu lógica para saber si el usuario está logueado.
  // Lo más común es checar si existe un token guardado (por ejemplo, en localStorage)
  const token = localStorage.getItem('token'); 

  if (token) {
    // Si hay sesión iniciada, lo dejamos pasar a la vista
    return true; 
  } else {
    // Si no tiene sesión, lo mandamos directo al login
    router.navigate(['/login']);
    return false;
  }
};
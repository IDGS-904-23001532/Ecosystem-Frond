import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProspectosComponent } from './components/prospectos/prospectos.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';

export const routes: Routes = [
  // Si la ruta está vacía, redirige automáticamente al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Ruta para el inicio de sesión
  { path: 'login', component: LoginComponent },
  
  // Ruta para el panel de control
  { path: 'dashboard', component: DashboardComponent },

  // Ruta para prospectos
  { path: 'prospectos', component: ProspectosComponent },

  // Rutas placeholder para modulos en construccion
  { path: 'cotizaciones', component: CotizacionesComponent},
  {
    path: 'contabilidad',
    component: PlaceholderPageComponent,
    data: {
      title: 'Contabilidad',
      description: 'Este modulo mostrara facturacion, ingresos y reportes financieros.',
      icon: '🧾'
    }
  },
  {
    path: 'configuracion',
    component: PlaceholderPageComponent,
    data: {
      title: 'Configuracion',
      description: 'Administra usuarios, permisos y preferencias del sistema.',
      icon: '⚙️'
    }
  },
  
  // Comodín por si escriben una ruta inexistente, redirige al login
  { path: '**', redirectTo: 'login' }
];
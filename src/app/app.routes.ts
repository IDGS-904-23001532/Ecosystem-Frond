import { Routes } from '@angular/router';

// Importar los componentes de las rutas ecommerce publicas
import { HomeComponent } from './ecommerce/features/home/home.component';

// Importar los componentes de las rutas gestion administrativas
import { LoginComponent } from './gestion/features/login/login.component';
import { RegistrarComponent } from './gestion/features/registrarse/registrar.component';
import { DashboardComponent } from './gestion/features/dashboard/dashboard.component';
import { ProspectosComponent } from './gestion/features/prospectos/prospectos.component';
import { CotizacionesComponent } from './gestion/features/cotizaciones/cotizaciones.component';
import { PlaceholderPageComponent } from './gestion/shared/components/placeholder-page/placeholder-page.component';
import { ClientesComponent } from './gestion/features/clientes/clientes.component';
import { UsuariosComponent } from './gestion/features/usuarios/usuarios.component';

export const routes: Routes = [
  // Si la ruta está vacía, redirige automáticamente al login
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Ruta para la página de inicio pública
  {path: 'home', component: HomeComponent},
  // Ruta para el inicio de sesión
  { path: 'login', component: LoginComponent },
  
  // Ruta para el registro de nuevos usuarios
  { path: 'registrarse', component: RegistrarComponent },

  // Ruta para salir del sistema y volver al login
  { path: 'logout', redirectTo: 'login' },
  
  // Ruta para el panel de control
  { path: 'dashboard', component: DashboardComponent },

  // Ruta para prospectos
  { path: 'prospectos', component: ProspectosComponent },

  // Rutas para cotizaciones
  { path: 'cotizaciones', component: CotizacionesComponent},
  
  // Rutas para clientes
  { path: 'clientes', component: ClientesComponent },

  // Ruta para usuarios
  { path: 'usuarios', component: UsuariosComponent },
  
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
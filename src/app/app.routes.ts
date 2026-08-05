import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
// Importar los componentes de las rutas ecommerce publicas
import { HomeComponent } from './ecommerce/features/home/home.component';
import { CalculadoraAhorroComponent } from './ecommerce/features/calculadora-ahorro/calculadora-ahorro.component';
import { LandingPlaceholderPageComponent } from './ecommerce/shared/components/landing-placeholder-page/landing-placeholder-page.component';
import { PorQueEscogernosComponent } from './ecommerce/features/por-que-escogernos/por-que-escogernos.component';
import { PaqueteHogarComponent } from './ecommerce/features/paquete-hogar/paquete-hogar';
import { PaqueteEmpresarialComponent } from './ecommerce/features/paquete-empresarial/paquete-empresarial';
import { NosotrosComponent } from './ecommerce/features/nosotros/nosotros';

// Importar los componentes de las rutas gestion administrativas
import { LoginComponent } from './gestion/features/login/login.component';
import { RegistrarComponent } from './gestion/features/registrarse/registrar.component';
import { DashboardComponent } from './gestion/features/dashboard/dashboard.component';
import { ProspectosComponent } from './gestion/features/prospectos/prospectos.component';
import { CotizacionesComponent } from './gestion/features/cotizaciones/cotizaciones.component';
import { PlaceholderPageComponent } from './gestion/shared/components/placeholder-page/placeholder-page.component';
import { ClientesComponent } from './gestion/features/clientes/clientes.component';
import { VentasComponent } from './gestion/features/ventas/ventas.component';
import { UsuariosComponent } from './gestion/features/usuarios/usuarios.component';
import { ContactoComponent } from './ecommerce/features/home/components/contacto/contacto';
import { ProveedoresComponent } from './gestion/features/proveedores/proveedores';
import { GastosComponent } from './gestion/features/gastos/gastos.component';
import { OrdenServicioComponent } from './gestion/features/orden-servicio/orden-servicio.component';

import { ProductosComponent } from './gestion/features/productos/productos';

import { IngresosComponent } from './gestion/features/ingresos/ingresos.component';


export const routes: Routes = [
  // ==========================================
  // RUTAS PÚBLICAS (Sin protección)
  // ==========================================
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrarse', component: RegistrarComponent },
  { path: 'logout', redirectTo: 'login' },
  
  // Rutas de la Landing Page
  { path: 'paquetes/hogar', component: PaqueteHogarComponent },
  { path: 'paquetes/empresarial', component: PaqueteEmpresarialComponent },
  { path: 'conocenos/nosotros', component: NosotrosComponent },
  { path: 'calculadora-ahorro', component: CalculadoraAhorroComponent },
  { path: 'conocenos/contactar', component: ContactoComponent },

  // ==========================================
  // RUTAS PRIVADAS / GESTIÓN (Protegidas)
  // ==========================================
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'prospectos', component: ProspectosComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'cotizaciones', component: CotizacionesComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'empleados', component: UsuariosComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'usuarios', redirectTo: 'empleados', pathMatch: 'full' },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'gastos', component: GastosComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'ingresos', component: IngresosComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'ordenes-servicio', component: OrdenServicioComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] }, // <-- PROTEGIDA
  
  {
    path: 'contabilidad',
    component: PlaceholderPageComponent,
    canActivate: [authGuard], // <-- PROTEGIDA
    data: {
      title: 'Contabilidad',
      description: 'Este modulo mostrara facturacion, ingresos y reportes financieros.',
      icon: '🧾'
    }
  },
  {
    path: 'configuracion',
    component: PlaceholderPageComponent,
    canActivate: [authGuard], // <-- PROTEGIDA
    data: {
      title: 'Configuracion',
      description: 'Administra usuarios, permisos y preferencias del sistema.',
      icon: '⚙️'
    }
  },

  // Comodín por si escriben una ruta inexistente, redirige al login
  { path: '**', redirectTo: 'login' }
];
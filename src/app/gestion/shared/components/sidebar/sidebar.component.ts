import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SidebarItem {
  label: string;
  icon?: string;
  route: string;
  exact?: boolean;
  children?: SidebarItem[];
}

interface SidebarSection {
  label: string;
  icon?: string;
  route?: string;
  exact?: boolean;
  isOpen?: boolean;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  isMobileMenuOpen = false;

  sections: SidebarSection[] = [
    {
      label: 'Dashboard',
      icon: '🏠',
      route: '/dashboard',
      exact: true
    },
    {
      label: 'Comercial',
      icon: '🏪',
      isOpen: false,
      children: [
        { label: 'Prospectos', icon: '👥', route: '/prospectos', exact: true },
        { label: 'Cotizaciones', icon: '📋', route: '/cotizaciones', exact: true },
        { label: 'Clientes', icon: '🧑‍💼', route: '/clientes', exact: true },
        { label: 'Ventas', icon: '🛒', route: '/ventas', exact: true }
      ]
    },
    {
      label: 'Contabilidad',
      icon: '💰',
      isOpen: false,
      children: [
         { label: 'Empleados', icon: '👥', route: '/empleados', exact: true },
        { label: 'Ingresos', icon: '💵', route: '/facturas', exact: true },
        { label: 'Gastos', icon: '💸', route: '/gastos', exact: true }
      ]
    },
    {
      label: 'Archivos',
      icon: '📁',
      isOpen: false,
      children: [
        { label: 'Ordenes de Servicio', icon: '📋', route: '/ordenes-servicio', exact: true },
        { label: 'Bitácoras', icon: '📓', route: '/bitacoras', exact: true }
      ]
    },
    {
      label: 'Configuracion',
      icon: '⚙️',
      isOpen: false,
      children: [
        { label: 'Usuarios', icon: '👥', route: '/configuracion', exact: true }]
    },
    {
      label: 'Salir',
      icon: '🚪',
      route: '/logout',
      exact: true
    }
  ];

toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    if (window.innerWidth <= 1024) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleSection(section: SidebarSection): void {
    if (section.children) {
      section.isOpen = !section.isOpen;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 1024) {
      this.isMobileMenuOpen = false;
    }
  }
}
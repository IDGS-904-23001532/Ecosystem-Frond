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
  templateUrl: './sidebar.component.html'
})

export class SidebarComponent {
  isMobileMenuOpen = false;

  sections: SidebarSection[] = [
    {
      label: 'Dashboard',
      icon: 'home',
      route: '/dashboard',
      exact: true
    },
    {
      label: 'Comercial',
      icon: 'store',
      isOpen: false,
      children: [
        { label: 'Prospectos', icon: 'group', route: '/prospectos', exact: true },
        { label: 'Cotizaciones', icon: 'list_alt', route: '/cotizaciones', exact: true },
        { label: 'Clientes', icon: 'manage_accounts', route: '/clientes', exact: true },
        { label: 'Ventas', icon: 'shopping_cart', route: '/ventas', exact: true }
      ]
    },
    {
      label: 'Contabilidad',
      icon: 'account_balance',
      isOpen: false,
      children: [
        { label: 'Ingresos', icon: 'attach_money', route: '/facturas', exact: true },
        { label: 'Gastos', icon: 'money_off', route: '/gastos', exact: true }
      ]
    },
    {
      label: 'Archivos',
      icon: 'folder',
      isOpen: false,
      children: [
        { label: 'Ordenes de Servicio', icon: 'assignment', route: '/ordenes-servicio', exact: true },
        { label: 'Bitácoras', icon: 'menu_book', route: '/bitacoras', exact: true }
      ]
    },
    {
      label: 'Configuracion',
      icon: 'settings',
      isOpen: false,
      children: [
        { label: 'Empleados', icon: 'badge', route: '/empleados', exact: true }]
    },
    {
      label: 'Salir',
      icon: 'logout',
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
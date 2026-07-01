import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SidebarItem {
  label: string;
  route: string;
  exact?: boolean;
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
        { label: 'Prospectos', route: '/prospectos', exact: true },
        { label: 'Cotizaciones', route: '/cotizaciones', exact: true },
        { label: 'Ventas', route: '/ventas', exact: true }
      ]
    },
    {
      label: 'Contabilidad',
      icon: '💰',
      isOpen: false,
      children: [
        { label: 'Gastos', route: '/contabilidad', exact: true },
        { label: 'Ingresos', route: '/contabilidad', exact: true }
      ]
    },
    {
      label: 'Archivos',
      icon: '📁',
      isOpen: false,
      children: [
        { label: 'Ordenes de Servicio', route: '/contabilidad', exact: true },
        { label: 'Bitacora', route: '/contabilidad', exact: true }
      ]
    },
    {
      label: 'Configuracion',
      icon: '⚙️',
      isOpen: false,
      children: [{ label: 'Usuarios', route: '/configuracion', exact: true }]
    }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
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
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      this.isMobileMenuOpen = false;
    }
  }
}
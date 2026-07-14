import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon?: string;
  route: string;
  exact?: boolean;
  children?: MenuItem[];
}

interface MenuSection {
  label: string;
  icon?: string;
  route?: string;
  exact?: boolean;
  isOpen?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopBarComponent {
  isMobileMenuOpen = false;

  sections: MenuSection[] = [
    {
      label: 'Inicio',
      icon: '🏠',
      route: '/home',
      exact: true
    },
    { 
      label: 'Ingresar',
      icon: '🚪',
      route: '/login',
      exact: true
    },
    {
      label: 'Servicios',
      icon: '🔧',
      isOpen: false,
      children: [
        { label: 'Instalación', icon: '🛠️', route: '/servicios/instalacion', exact: true },
        { label: 'Mantenimiento', icon: '🧰', route: '/servicios/mantenimiento', exact: true },
        { label: 'Reparación', icon: '🔩', route: '/servicios/reparacion', exact: true },
        { label: 'Monitoreo', icon: '📡', route: '/servicios/monitoreo', exact: true }
      ]
    },
    {
      label: 'Productos',
      icon: '🛍️',
      isOpen: false,
      children: [
        { label: 'Paneles Solares', icon: '☀️', route: '/productos/paneles-solares', exact: true },
        { label: 'Baterías', icon: '🔋', route: '/productos/baterias', exact: true },
        { label: 'Inversores', icon: '⚡', route: '/productos/inversores', exact: true },
        { label: 'Kits de Energía', icon: '📦', route: '/productos/kits-energia', exact: true }
      ]
    },
    {
      label: 'Conocenos',
      icon: '👥',
      isOpen: false, // ¡Agregado para correcta sincronización!
      children: [
        { label: 'Nosotros', icon: '🏢', route: '/conocenos/nosotros', exact: true },
        { label: 'Contactar', icon: '✉️', route: '/conocenos/contactar', exact: true },
        { label: 'Cotización', icon: '🧾', route: '/conocenos/cotizacion', exact: true },
        { label: 'Testimonios', icon: '⭐', route: '/conocenos/testimonios', exact: true }
      ]
    },
    {
      label: 'Soporte',
      icon: '🛠️',
      isOpen: false, // ¡Agregado para correcta sincronización!
      children: [
        { label: 'Ayuda', icon: '❓', route: '/soporte/ayuda', exact: true },
        { label: 'Preguntas Frecuentes', icon: '📖', route: '/soporte/preguntas-frecuentes', exact: true },
        { label: 'Asesoramiento Técnico', icon: '👨‍🔧', route: '/soporte/asesoramiento-tecnico', exact: true },
        { label: 'Atención al Cliente', icon: '📄', route: '/soporte/atencion-al-cliente', exact: true }
      ]
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

  toggleSection(section: MenuSection): void {
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
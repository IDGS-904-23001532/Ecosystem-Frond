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
      icon: 'home',
      route: '/home',
      exact: true
    },
    { 
      label: 'Ingresar',
      icon: 'login',
      route: '/login',
      exact: true
    },
    {
      label: 'Servicios',
      icon: 'build',
      isOpen: false,
      children: [
        { label: 'Instalación', icon: 'handyman', route: '/servicios/instalacion', exact: true },
        { label: 'Mantenimiento', icon: 'home_repair_service', route: '/servicios/mantenimiento', exact: true },
        { label: 'Reparación', icon: 'hardware', route: '/servicios/reparacion', exact: true },
        { label: 'Monitoreo', icon: 'satellite_alt', route: '/servicios/monitoreo', exact: true }
      ]
    },
    {
      label: 'Productos',
      icon: 'shopping_bag',
      isOpen: false,
      children: [
        { label: 'Paneles Solares', icon: 'solar_power', route: '/productos/paneles-solares', exact: true },
        { label: 'Baterías', icon: 'battery_charging_full', route: '/productos/baterias', exact: true },
        { label: 'Inversores', icon: 'bolt', route: '/productos/inversores', exact: true },
        { label: 'Kits de Energía', icon: 'package', route: '/productos/kits-energia', exact: true }
      ]
    },
    {
      label: 'Conocenos',
      icon: 'group',
      isOpen: false,
      children: [
        { label: 'Nosotros', icon: 'domain', route: '/conocenos/nosotros', exact: true },
        { label: 'Contactar', icon: 'mail', route: '/conocenos/contactar', exact: true },
        { label: 'Cotización', icon: 'receipt_long', route: '/conocenos/cotizacion', exact: true },
        { label: 'Testimonios', icon: 'star', route: '/conocenos/testimonios', exact: true }
      ]
    },
    {
      label: 'Soporte',
      icon: 'support_agent',
      isOpen: false,
      children: [
        { label: 'Ayuda', icon: 'help', route: '/soporte/ayuda', exact: true },
        { label: 'Preguntas Frecuentes', icon: 'quiz', route: '/soporte/preguntas-frecuentes', exact: true },
        { label: 'Asesoramiento Técnico', icon: 'engineering', route: '/soporte/asesoramiento-tecnico', exact: true },
        { label: 'Atención al Cliente', icon: 'support', route: '/soporte/atencion-al-cliente', exact: true }
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
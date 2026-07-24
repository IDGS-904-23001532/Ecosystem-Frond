import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  exact?: boolean;
  children?: MenuItem[];
  isOpen?: boolean;
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
  templateUrl: './topbar.component.html'
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
      label: 'Paquetes',
      icon: 'inventory_2',
      isOpen: false,
      children: [
        { label: 'Hogar', icon: 'home', route: '/paquetes/hogar', exact: true },
        { label: 'Empresarial', icon: 'business', route: '/paquetes/empresarial', exact: true }
      ]
    },
    {
      label: 'Conócenos',
      icon: 'group',
      route: '/conocenos/nosotros',
      exact: true
    },
    {
      label: 'Cotización',
      icon: 'receipt_long',
      route: '/calculadora-ahorro',
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
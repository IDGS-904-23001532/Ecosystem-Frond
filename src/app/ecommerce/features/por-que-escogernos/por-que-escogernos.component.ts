import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-por-que-escogernos',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './por-que-escogernos.component.html'
})
export class PorQueEscogernosComponent {
  cards = [
    {
      title: 'Servicio Completo',
      description: 'Nosotros nos encargamos de todo. Desde la instalación profesional de tus paneles solares hasta el mantenimiento continuo y la reparación en caso de ser necesaria.',
      icon: 'handyman',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Monitoreo Ágil',
      description: 'Tenemos una aplicación móvil exclusiva donde puedes monitorear en tiempo real la generación de energía y el rendimiento de tus paneles solares desde cualquier lugar.',
      icon: 'smartphone',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Expertos Dedicados',
      description: 'Somos una empresa 100% dedicada a la transición energética. Contamos con un equipo de ingenieros especializados para brindarte la mejor asesoría y resultados.',
      icon: 'engineering',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Garantía y Confianza',
      description: 'Tu inversión está segura con nosotros. Ofrecemos garantías extendidas y soporte técnico prioritario para que nunca te quedes sin energía.',
      icon: 'verified_user',
      color: 'bg-orange-50 text-orange-600'
    }
  ];
}

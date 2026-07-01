import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  @Input() title = 'Panel de Control';
  @Input() subtitle = 'Monitoreo general de operaciones y rendimiento sustentable.';
  @Input() username = 'Karla Martinez';
  @Input() userInitials = 'KM';
}

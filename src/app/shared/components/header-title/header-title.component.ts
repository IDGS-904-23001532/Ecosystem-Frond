import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header-title',
  standalone: true,
  templateUrl: './header-title.component.html'
})
export class HeaderTitleComponent implements OnInit {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() username!: string; // Mantenido para evitar errores de compilación
  @Input() userInitials!: string; // Mantenido para evitar errores de compilación
  
  userInfo: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  }

  get displayUsername(): string {
    if (!this.userInfo) return 'Ecosystem User';
    return this.userInfo.nombreCompleto || 
           this.userInfo.name || 
           this.userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
           'Ecosystem User';
  }

  get displayUserInitials(): string {
    const name = this.displayUsername;
    if (!name) return 'EU';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get displayUserRole(): string {
    if (!this.userInfo) return 'Usuario';
    const role = this.userInfo.puesto || 
                 this.userInfo.role || 
                 this.userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                 '';
    // Mapeo básico si devuelve números
    if (role === '1') return 'Super Admin';
    if (role === '2') return 'Administrador';
    if (role === '3') return 'Empleado';
    return role || 'Usuario';
  }
}

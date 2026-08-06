import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { RouterModule } from '@angular/router';
import { CtaContactoComponent } from './components/cta-contacto/cta-contacto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopBarComponent, HeroComponent, RouterModule, CtaContactoComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // URL del APK — en producción tomará el dominio real de Railway
  readonly apkPath = '/downloads/ecosystem.apk';

  get qrUrl(): string {
    const base = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://tu-app.railway.app';
    const apkUrl = encodeURIComponent(`${base}${this.apkPath}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&bgcolor=ffffff&data=${apkUrl}`;
  }
}
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { CotizacionComponent } from '../cotizacion/cotizacion.component';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent, CotizacionComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {}
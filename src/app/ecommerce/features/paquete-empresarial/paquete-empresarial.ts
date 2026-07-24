import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-paquete-empresarial',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './paquete-empresarial.html'
})
export class PaqueteEmpresarialComponent {}

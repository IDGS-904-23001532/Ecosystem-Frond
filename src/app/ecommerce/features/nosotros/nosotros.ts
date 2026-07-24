import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './nosotros.html'
})
export class NosotrosComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-contactar',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './contactar.html'
})
export class ContactarComponent {}

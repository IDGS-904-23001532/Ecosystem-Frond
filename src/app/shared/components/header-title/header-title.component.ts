import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-title',
  standalone: true,
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.scss']
})
export class HeaderTitleComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() username!: string;
  @Input() userInitials!: string;
}

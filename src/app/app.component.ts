import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- Importa RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- Agrégalo a los imports en lugar del LoginComponent
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'control-ecosystem';
}
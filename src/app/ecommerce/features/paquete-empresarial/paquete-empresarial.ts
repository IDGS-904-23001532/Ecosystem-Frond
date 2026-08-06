import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';
import { CtaContactoComponent } from '../home/components/cta-contacto/cta-contacto';
import { ProductoService } from '../../../gestion/features/productos/services/producto';
import { Producto } from '../../../gestion/features/productos/productos';

@Component({
  selector: 'app-paquete-empresarial',
  standalone: true,
  imports: [CommonModule, RouterModule, TopBarComponent, CtaContactoComponent, CurrencyPipe],
  templateUrl: './paquete-empresarial.html'
})
export class PaqueteEmpresarialComponent implements OnInit {
  private productoService = inject(ProductoService);
  productos = signal<Producto[]>([]);

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }
}

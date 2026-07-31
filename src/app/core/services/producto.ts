import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  rutaImagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = '/api/Producto';

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}

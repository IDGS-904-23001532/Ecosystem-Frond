import { inject, Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../productos';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  
  // Usamos el proxy relativo que configuramos antes
  private apiUrl = '/api/Producto'; 

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerProductoPorNombre(nombre: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${nombre}`);
  }

  // CAMBIO CLAVE: Recibe FormData (multipart/form-data)
  crearProducto(datosFormulario: FormData): Observable<any> {
    return this.http.post(this.apiUrl, datosFormulario);
  }

  // CAMBIO CLAVE: Recibe FormData
  actualizarProducto(id: number, datosFormulario: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datosFormulario);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
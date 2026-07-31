import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearVentaDto {
  idCliente: number;
  total: number;
  descripcion: string | null;
  metodoPago: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = '/api/Venta';

  constructor(private http: HttpClient) {}

  listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerVenta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearVenta(data: CrearVentaDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  completarVenta(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/completar`, {});
  }

  eliminarVenta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

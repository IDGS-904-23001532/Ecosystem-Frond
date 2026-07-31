import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleCotizacionDto {
  idProducto: number;
  cantidad: number;
}

export interface CrearCotizacionDto {
  idProspecto: number;
  costoInstalacion: number;
  detalles: DetalleCotizacionDto[];
}

export interface AceptarCotizacionDto {
  metodoPago: string | null;
  descripcion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = '/api/Cotizacion';

  constructor(private http: HttpClient) {}

  listarCotizaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearCotizacion(data: CrearCotizacionDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarCotizacion(id: number, data: CrearCotizacionDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  obtenerCotizacion(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  eliminarCotizacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  aceptarCotizacion(idCotizacion: number, data: AceptarCotizacionDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idCotizacion}/aceptar`, data);
  }

  rechazarCotizacion(idCotizacion: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idCotizacion}/rechazar`, {});
  }
}

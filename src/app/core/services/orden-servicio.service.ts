import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrdenServicioDto {
  idCliente: number;
  fechaProgramada: string;
  detalleManual: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioService {
  private apiUrl = '/api/OrdenServicio';

  constructor(private http: HttpClient) {}

  listarOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerOrden(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  registrarOrden(data: OrdenServicioDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarEstatus(id: number, nuevoEstatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estatus`, { nuevoEstatus });
  }

  eliminarOrden(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

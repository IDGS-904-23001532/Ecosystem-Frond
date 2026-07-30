import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GastoDto {
  fecha: string;
  idProveedor: number;
  concepto: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private apiUrl = '/api/Gastos';

  constructor(private http: HttpClient) {}

  listarGastos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar-gastos`);
  }

  registrarGasto(data: GastoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-gasto`, data);
  }

  actualizarGasto(id: number, data: GastoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-gasto/${id}`, data);
  }

  eliminarGasto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-gasto/${id}`);
  }
}

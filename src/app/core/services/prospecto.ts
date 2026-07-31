import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface RegistroProspectoDto {
  nombre: string;
  apellido: string;
  telefono: string;
  corporativo?: string;
  localidad: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProspectoService {
  private apiUrl = '/api/Prospecto';

  constructor(private http: HttpClient) {}

  registrarProspecto(data: RegistroProspectoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-prospecto`, data);
  }

  listarProspectos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar-prospectos`);
  }

  listarProspectosPorEstado(estado: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar-prospectos/${estado}`);
  }

  listarTodosProspectos(): Observable<any[]> {
    return forkJoin([
      this.listarProspectos(),
      this.listarProspectosPorEstado('Aceptado'),
      this.listarProspectosPorEstado('Cancelado')
    ]).pipe(
      map(([pendientes, aceptadosResp, canceladosResp]: [any[], any, any]) => {
        const aceptados: any[] = Array.isArray(aceptadosResp)
          ? aceptadosResp
          : (aceptadosResp?.Datos ?? []);
        const cancelados: any[] = Array.isArray(canceladosResp)
          ? canceladosResp
          : (canceladosResp?.Datos ?? []);
        return [...pendientes, ...aceptados, ...cancelados];
      })
    );
  }
}
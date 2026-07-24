import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
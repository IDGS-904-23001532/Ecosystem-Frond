import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProveedorDto {
  nombre: string;
  contacto: string;
  informacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = '/api/Proveedor';

  constructor(private http: HttpClient) {}

  listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  obtenerProveedor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  registrarProveedor(data: ProveedorDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  actualizarProveedor(id: number, data: ProveedorDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
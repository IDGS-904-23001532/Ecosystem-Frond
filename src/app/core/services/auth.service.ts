import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/Usuario';

  constructor(private http: HttpClient) {}

  registroCliente(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro-cliente`, userData);
  }

  registroEmpleado(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro-empleado`, userData);
  }

  private clientesCache$: Observable<any[]> | null = null;

  listarClientes(forceRefresh: boolean = false): Observable<any[]> {
    if (!this.clientesCache$ || forceRefresh) {
      this.clientesCache$ = this.http.get<any[]>(`${this.apiUrl}/listar-clientes`).pipe(
        shareReplay(1)
      );
    }
    return this.clientesCache$;
  }

  private empleadosCache$: Observable<any[]> | null = null;

  listarEmpleados(forceRefresh: boolean = false): Observable<any[]> {
    if (!this.empleadosCache$ || forceRefresh) {
      this.empleadosCache$ = this.http.get<any[]>(`${this.apiUrl}/listar-empleados`).pipe(
        shareReplay(1)
      );
    }
    return this.empleadosCache$;
  }
}

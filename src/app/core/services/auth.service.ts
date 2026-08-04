import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/Usuario';
  private authApiUrl = '/api/Auth';

  constructor(private http: HttpClient) {}

  registroCliente(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro-cliente`, userData);
  }

  actualizarCliente(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cliente/${id}`, data);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cliente/${id}`);
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

  login(credentials: { correo: string; password: string }): Observable<any> {
    return this.http.post(`${this.authApiUrl}/login`, credentials, { responseType: 'text' as 'json' });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authApiUrl}/logout`, {});
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      let payload = token.split('.')[1];
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(window.atob(payload).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
      return decoded;
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }
}

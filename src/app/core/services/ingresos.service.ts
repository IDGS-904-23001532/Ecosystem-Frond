import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private apiUrl = '/api/Ingresos';

  constructor(private http: HttpClient) {}

  getResumen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }

  getPeriodo(inicio: string, fin: string): Observable<any[]> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<any[]>(`${this.apiUrl}/periodo`, { params });
  }

  getGraficaAnual(anio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grafica-anual/${anio}`);
  }
}

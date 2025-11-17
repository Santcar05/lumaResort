import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'https://backend-lumaresort.onrender.com/api/dashboard'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getEstadisticasGenerales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`);
  }

  getReservasPorMes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservas-por-mes`);
  }

  getReservasPorEstado(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservas-por-estado`);
  }

  getIngresosPorMes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ingresos-por-mes`);
  }

  getOcupacionActual(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ocupacion-actual`);
  }
}

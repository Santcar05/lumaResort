import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../../../Models/Servicio';
@Injectable({
  providedIn: 'root',
})
export class CRUDServiciosService {
  private apiUrl = 'https://backend-lumaresort.onrender.com/servicios';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  findById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio);
  }

  update(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../../../Models/Servicio';

@Injectable({
  providedIn: 'root',
})
export class CRUDServiciosService {
  private apiUrl = 'http://localhost:8080/servicios';

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios
  findAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  // Crear un servicio nuevo
  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio);
  }

  // Actualizar un servicio
  update(servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${servicio.idServicio}`, servicio);
  }

  // Eliminar un servicio por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

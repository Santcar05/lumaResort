import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoHabitacion } from '../Models/TipoHabitacion';

@Injectable({
  providedIn: 'root',
})
export class TipoHabitacionService {
  private apiUrl = 'http://localhost:8080/tiposHabitacion';

  constructor(private http: HttpClient) {}

  // Obtener todos los tipos de habitación
  findAll(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.apiUrl);
  }

  // Crear nuevo tipo
  create(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.apiUrl, tipo);
  }

  // Actualizar tipo existente
  update(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`${this.apiUrl}/${tipo.id}`, tipo);
  }

  // Eliminar tipo por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

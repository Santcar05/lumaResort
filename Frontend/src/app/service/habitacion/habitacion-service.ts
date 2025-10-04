import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../../Models/Habitacion';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private apiUrl = 'http://localhost:8080/habitaciones';

  constructor(private http: HttpClient) {}

  // Obtener todas las habitaciones
  findAll(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl);
  }

  // Crear una nueva habitación
  create(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.apiUrl, habitacion);
  }

  // Actualizar habitación existente
  update(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/${habitacion.idHabitacion}`, habitacion);
  }

  // Eliminar una habitación
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

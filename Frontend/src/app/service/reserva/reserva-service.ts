import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../../Models/Reserva';
import { Habitacion } from '../../Models/Habitacion';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient) {}

  // Obtener todas las reservas
  findAll(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  // Crear una nueva reserva
  create(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  // Actualizar una reserva existente
  update(reserva: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${reserva.idReserva!}`, reserva);
  }

  // Eliminar una reserva por ID
  delete(id: number): Observable<void> {
    console.log('Eliminando reserva con ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar una reserva por ID
  findById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  removerServicio(idReserva: number, idServicio: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idReserva}/servicios/${idServicio}`);
  }

  contratarServicio(idServicio: number, idHabitacion: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idServicio}/contratar/${idHabitacion}`, {});
  }

  getHabitacionesDisponibles(idServicio: number): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/habitaciones/disponibles/${idServicio}`);
  }

  cancelarReserva(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancelar/${id}`, {});
  }
}

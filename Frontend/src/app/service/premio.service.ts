import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Premio } from '../Models/Premio';

@Injectable({
  providedIn: 'root',
})
export class PremioService {
  private apiUrl = 'http://localhost:8080/premios';

  constructor(private http: HttpClient) {}

  // Obtener todos los premios
  findAll(): Observable<Premio[]> {
    return this.http.get<Premio[]>(this.apiUrl);
  }

  // Obtener premios disponibles 
  getPremiosDisponibles(): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${this.apiUrl}/disponibles`);
  }

  // Obtener premio por ID
  findById(id: number): Observable<Premio> {
    return this.http.get<Premio>(`${this.apiUrl}/${id}`);
  }

  // Obtener premios ganados por un usuario
  getPremiosByUsuario(usuarioId: number): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Obtener premios de una reserva
  getPremiosByReserva(reservaId: number): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${this.apiUrl}/reserva/${reservaId}`);
  }

  // Asignar premio a usuario y reserva
  asignarPremio(premioId: number, usuarioId: number, reservaId: number): Observable<Premio> {
    const payload = {
      premioId: premioId,
      usuarioId: usuarioId,
      reservaId: reservaId
    };
    return this.http.post<Premio>(`${this.apiUrl}/asignar`, payload);
  }

  // Crear nuevo premio 
  create(premio: Premio): Observable<Premio> {
    return this.http.post<Premio>(this.apiUrl, premio);
  }

  // Eliminar premio por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../../Models/Pago';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'https://backend-lumaresort.onrender.com/pagos';

  constructor(private http: HttpClient) {}

  // Obtener todos los pagos
  findAll(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  // Crear un nuevo pago
  create(pago: Pago): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, pago);
  }

  // Buscar un pago por ID
  findById(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un pago existente
  update(pago: Pago): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/${pago.idPago}`, pago);
  }

  // Eliminar un pago por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener pagos por reserva
  findByReserva(idReserva: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/reserva/${idReserva}`);
  }
}

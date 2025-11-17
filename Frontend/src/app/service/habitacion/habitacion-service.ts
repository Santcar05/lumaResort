import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../../Models/Habitacion';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private apiUrl = 'https://backend-lumaresort.onrender.com/habitaciones';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl);
  }

  create(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.apiUrl, habitacion);
  }

  update(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/${habitacion.idHabitacion!}`, habitacion);
  }

  delete(id: number): Observable<void> {
    //Ver en consola el id que se está enviando
    console.log('Eliminando habitación con ID:', id);
    //Realizar la petición DELETE al backend
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }

  findById(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../Models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'https://backend-lumaresort.onrender.com/clientes';

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes
  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Crear cliente nuevo
  create(cliente: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, cliente);
  }

  // Actualizar cliente existente
  update(cliente: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${cliente.idUsuario!}`, cliente);
  }

  // Eliminar cliente
  delete(id: number): Observable<void> {
    console.log('Eliminando cliente con ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar cliente por ID
  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  findByUsuarioId(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/${idUsuario}`);
  }
}

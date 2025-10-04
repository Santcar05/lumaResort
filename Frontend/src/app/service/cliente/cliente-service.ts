import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../Models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Crear un nuevo usuario
  create(cliente: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, cliente);
  }

  // Actualizar un usuario
  update(cliente: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${cliente.idUsuario}`, cliente);
  }

  // Eliminar un usuario por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../../Models/Usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'https://backend-lumaresort.onrender.com/usuario'; // debe coincidir con backend

  constructor(private http: HttpClient) {}

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  login(correo: string, contrasena: string): Observable<Usuario> {
    const body = { correo, contrasena };
    return this.http.post<Usuario>(`${this.apiUrl}/login`, body).pipe(
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Credenciales incorrectas'));
      })
    );
  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}

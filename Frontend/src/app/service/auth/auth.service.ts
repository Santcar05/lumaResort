import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../../Models/AuthResponse';
import { LoginRequest } from '../../Models/LoginRequest';
import { RegisterRequest } from '../../Models/RegisterRequest';
import { UserResponse } from '../../Models/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  private isBrowser: boolean;

  // BehaviorSubject para observar cambios en autenticación
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Login - Autenticar usuario
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.usuario);
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  /**
   * Register - Registrar nuevo usuario
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.usuario);
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  /**
   * Logout - Cerrar sesión
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Obtener usuario actual del backend
   */
  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/actual`)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Obtener token JWT
   */
  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtener usuario actual del localStorage
   */
  getUser(): UserResponse | null {
    return this.getUserFromStorage();
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Verificar si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMINISTRADOR');
  }

  /**
   * Verificar si el usuario es operador
   */
  isOperador(): boolean {
    return this.hasRole('ROLE_OPERADOR');
  }

  /**
   * Verificar si el usuario es cliente
   */
  isCliente(): boolean {
    return this.hasRole('ROLE_CLIENTE');
  }

  /**
   * Métodos privados para manejo de storage
   */
  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private setUser(user: UserResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  private getUserFromStorage(): UserResponse | null {
    if (!this.isBrowser) {
      return null;
    }
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}

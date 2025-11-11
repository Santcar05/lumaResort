import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir a login si no está autenticado
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard para proteger rutas de ADMINISTRADOR
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Redirigir a home si no es admin
  router.navigate(['/']);
  return false;
};

/**
 * Guard para proteger rutas de OPERADOR
 */
export const operadorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && (authService.isOperador() || authService.isAdmin())) {
    return true;
  }

  // Redirigir a home si no es operador o admin
  router.navigate(['/']);
  return false;
};

/**
 * Guard para proteger rutas de CLIENTE
 */
export const clienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isCliente()) {
    return true;
  }

  // Redirigir a home si no es cliente
  router.navigate(['/']);
  return false;
};

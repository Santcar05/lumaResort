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
 * Guard para proteger rutas EXCLUSIVAS de ADMINISTRADOR
 * No permite acceso a OPERADOR ni CLIENTE
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  }

  // Redirigir según el rol del usuario
  if (authService.isOperador()) {
    router.navigate(['/operador/dashboard']);
  } else if (authService.isCliente()) {
    router.navigate(['/']);
  } else {
    router.navigate(['/']);
  }

  return false;
};

/**
 * Guard para proteger rutas EXCLUSIVAS de OPERADOR
 * No permite acceso a ADMIN ni CLIENTE
 */
export const operadorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (authService.isOperador()) {
    return true;
  }

  // Redirigir según el rol del usuario
  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  } else if (authService.isCliente()) {
    router.navigate(['/']);
  } else {
    router.navigate(['/']);
  }

  return false;
};

/**
 * Guard para proteger rutas EXCLUSIVAS de CLIENTE
 * No permite acceso a ADMIN ni OPERADOR
 */
export const clienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (authService.isCliente()) {
    return true;
  }

  // Redirigir según el rol del usuario
  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  } else if (authService.isOperador()) {
    router.navigate(['/operador/dashboard']);
  } else {
    router.navigate(['/']);
  }

  return false;
};

/**
 * Guard para páginas públicas
 * Solo permite acceso si NO está autenticado
 * Útil para login/register (evita que usuarios logueados accedan)
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Si ya está autenticado, redirigir según su rol
  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  } else if (authService.isOperador()) {
    router.navigate(['/operador/dashboard']);
  } else if (authService.isCliente()) {
    router.navigate(['/']);
  } else {
    router.navigate(['/']);
  }

  return false;
};

/**
 * Guard para rutas que cualquier usuario autenticado puede ver
 * (sin importar el rol)
 */
export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

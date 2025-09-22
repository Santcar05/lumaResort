import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page-components/landing-page-component/landing-page-component';
import { LoginComponent } from './login/login-component/login-component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // por defecto muestra Landing
  { path: 'login', component: LoginComponent }, // muestra login
  { path: '**', redirectTo: '' }, // redirección en caso de ruta no válida
];

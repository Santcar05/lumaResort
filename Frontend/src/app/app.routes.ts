import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page-components/landing-page-component/landing-page-component';
import { LoginComponent } from './login/login-component/login-component';
import { TipoHabitacionAdminComponent } from './tipo-habitacion-admin-component/tipo-habitacion-admin-component';
import { AdminComponent } from './admin-component/admin-component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // por defecto muestra Landing
  { path: 'login', component: LoginComponent }, // muestra login
  {
    path: 'admin',
    component: AdminComponent,
    children: [{ path: 'tiposHabitacion', component: TipoHabitacionAdminComponent }],
  },
  { path: '**', redirectTo: '' }, // redirección en caso de ruta no válida COLOCAR SIEMPRE AL FINAL
];

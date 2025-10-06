import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page-components/landing-page-component/landing-page-component';
import { LoginComponent } from './login/login-component/login-component';
import { TipoHabitacionAdminComponent } from './tipo-habitacion-admin-component/tipo-habitacion-admin-component';
import { AdminComponent } from './admin-component/admin-component';
import { ClienteAdminComponent } from './cliente-admin-component/cliente-admin-component';
import { ServiciosAdminComponent } from './servicios-admin-component/servicios-admin-component';
import { HabitacionesAdminComponent } from './habitaciones-admin-component/habitaciones-admin-component';
import { ReservaAdminComponent } from './reserva-admin-component/reserva-admin-component';
import { DetalleServicioComponent } from './detalle-servicio-component/detalle-servicio-component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // por defecto muestra Landing
  { path: 'login', component: LoginComponent }, // muestra login
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'tiposHabitacion', component: TipoHabitacionAdminComponent },
      { path: 'clientes', component: ClienteAdminComponent },
      { path: 'servicios', component: ServiciosAdminComponent },
      { path: 'habitaciones', component: HabitacionesAdminComponent },
      { path: 'reservas', component: ReservaAdminComponent },
    ],
  },
  { path: 'servicios/:id', component: DetalleServicioComponent },
  { path: '**', redirectTo: '' }, // redirección en caso de ruta no válida COLOCAR SIEMPRE AL FINAL
];

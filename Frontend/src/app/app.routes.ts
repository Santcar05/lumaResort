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
import { ListaServiciosComponent } from './lista-servicios-component/lista-servicios-component';
import { ReservasComponent } from './reservas-component/reservas-component';
import { SignUpComponent } from './sign-up-component/sign-up-component';
import { PerfilComponent } from './perfil-component/perfil-component';
import { VerReservasComponent } from './ver-reservas-component/ver-reservas-component';
import { ReservasOperadorComponent } from './reservas-operador-component/reservas-operador-component';
import { NavOperadorComponent } from './nav-operador-component/nav-operador-component';
import { ServiciosOperadorComponent } from './servicios-operador-component/servicios-operador-component';
import { OperadorComponent } from './operador-component/operador-component';
import { EstadiaOperadorComponent } from './estadia-operador-component/estadia-operador-component';
import { adminGuard, clienteGuard, operadorGuard, publicGuard } from './guards/auth.guard';
import { AdminDashboardComponentComponent } from './admin-dashboard-component/admin-dashboard-component';
import { ChatbotComponent } from './chatbot-component/chatbot-component';
import { OperadorPasarelaPagosComponent } from './operador-pasarela-pagos-component/operador-pasarela-pagos-component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // por defecto muestra Landing
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [publicGuard] },
  { path: 'perfil/:id', component: PerfilComponent }, // muestra perfil
  { path: 'chatbot', component: ChatbotComponent }, // muestra chatbot
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponentComponent },
      { path: 'tiposHabitacion', component: TipoHabitacionAdminComponent },
      { path: 'clientes', component: ClienteAdminComponent },
      { path: 'servicios', component: ServiciosAdminComponent },
      { path: 'habitaciones', component: HabitacionesAdminComponent },
      { path: 'reservas', component: ReservaAdminComponent },
    ],
  },
  {
    path: 'operador',
    component: OperadorComponent,
    canActivate: [operadorGuard],
    children: [
      { path: '', redirectTo: 'reservas', pathMatch: 'full' }, // Portal operador
      { path: 'reservas', component: ReservasOperadorComponent },
      { path: 'servicios', component: ServiciosOperadorComponent },
      {
        path: 'pago',
        component: EstadiaOperadorComponent,
      },
      {
        path: 'pasarela-pagos/:idReserva',
        component: OperadorPasarelaPagosComponent,
      },
      {
        path: 'limpiar-cuenta',
        component: ReservasOperadorComponent /* ComponentePagosComponent */,
      },
      {
        path: 'activar-estadia',
        component: ReservasOperadorComponent /* ComponenteEstadiasComponent */,
      },
      {
        path: 'finalizar-estadia',
        component: ReservasOperadorComponent /* ComponenteEstadiasComponent */,
      },
    ],
  },
  { path: 'servicios', component: ListaServiciosComponent },
  { path: 'servicios/:id', component: DetalleServicioComponent },
  { path: 'reservar/:id', component: ReservasComponent },
  { path: 'reservas/:id', component: VerReservasComponent },
  { path: 'reservas', component: ReservasComponent },
  // Ruta para clientes
  {
    path: 'cliente',
    component: LandingPageComponent,
    canActivate: [clienteGuard],
  },
  { path: '**', redirectTo: '' }, // redirección en caso de ruta
];

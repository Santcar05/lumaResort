import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './landing-page-components/landing-page-component/landing-page-component';
import { LoginComponent } from './login/login-component/login-component';
import { TipoHabitacionAdminComponent } from './tipo-habitacion-admin-component/tipo-habitacion-admin-component';
import { ActividadesService } from './service/actividades/actividades';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingPageComponent, LoginComponent, TipoHabitacionAdminComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [ActividadesService],
})
export class App {
  protected readonly title = signal('lumaResortAngular');
}

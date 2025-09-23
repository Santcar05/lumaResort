import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './landing-page-components/landing-page-component/landing-page-component';
import { LoginComponent } from './login/login-component/login-component';
import { TipoHabitacionAdminComponent } from './tipo-habitacion-admin-component/tipo-habitacion-admin-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingPageComponent, LoginComponent, TipoHabitacionAdminComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lumaResortAngular');
}

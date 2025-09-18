import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './generales-components/header-component/header-component';
import { BannerLandingPageComponent } from './landing-page-components/banner-landing-page-component/banner-landing-page-component';
import { DescubrimientoComponent } from './landing-page-components/descubrimiento-component/descubrimiento-component';
import { CatalogoServiciosComponent } from './servicios-components/catalogo-servicios-component/catalogo-servicios-component';
import { ActividadesComponent } from './servicios-components/actividades-component/actividades-component';
import { CarruselTiposHabitacionComponent } from './carrusel-tipos-habitacion-component/carrusel-tipos-habitacion-component';
import { TestimoniosComponent } from './landing-page-components/testimonios-component/testimonios-component';
import { ContactoFormComponent } from './landing-page-components/contacto-form-component/contacto-form-component';
import { FooterComponent } from './generales-components/footer-component/footer-component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    BannerLandingPageComponent,
    DescubrimientoComponent,
    CatalogoServiciosComponent,
    ActividadesComponent,
    CarruselTiposHabitacionComponent,
    TestimoniosComponent,
    ContactoFormComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lumaResortAngular');
}

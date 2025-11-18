import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../generales-components/header-component/header-component';
import { BannerLandingPageComponent } from '../../landing-page-components/banner-landing-page-component/banner-landing-page-component';
import { DescubrimientoComponent } from '../../landing-page-components/descubrimiento-component/descubrimiento-component';
import { CatalogoServiciosComponent } from '../../servicios-components/catalogo-servicios-component/catalogo-servicios-component';
import { ActividadesComponent } from '../../servicios-components/actividades-component/actividades-component';
import { CarruselTiposHabitacionComponent } from '../../carrusel-tipos-habitacion-component/carrusel-tipos-habitacion-component';
import { TestimoniosComponent } from '../../landing-page-components/testimonios-component/testimonios-component';
import { ContactoFormComponent } from '../../landing-page-components/contacto-form-component/contacto-form-component';
import { FooterComponent } from '../../generales-components/footer-component/footer-component';
import { DetalleServicioComponent } from '../../detalle-servicio-component/detalle-servicio-component';
import { AuthService } from '../../service/auth/auth.service';
import { SpotifyPlayerComponent } from '../../spotify-player-component/spotify-player-component';
import { FlashSaleBannerComponent } from '../../flash-sale-banner-component/flash-sale-banner.component';
@Component({
  selector: 'app-landing-page-component',
  imports: [
    CommonModule,
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
    DetalleServicioComponent,
    SpotifyPlayerComponent,
    FlashSaleBannerComponent,
  ],
  templateUrl: './landing-page-component.html',
  styleUrl: './landing-page-component.css',
})
export class LandingPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir según su rol
    if (this.authService.isAuthenticated()) {
      this.redirectByRole();
    }
  }

  /**
   * Redirige al usuario a su dashboard correspondiente según su rol
   */
  private redirectByRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.authService.isOperador()) {
      this.router.navigate(['/operador']);
    } else if (this.authService.isCliente()) {
      this.router.navigate(['/cliente']);
    }
  }
}

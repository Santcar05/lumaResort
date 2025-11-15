import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { UserResponse } from '../../Models/UserResponse';

// IMPORTANTE para traducciones
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css'],
})
export class HeaderComponent implements OnInit {
  menuVisible = false;
  perfilVisible = false;
  idiomasVisible = false;

  isLoggedIn = false;
  usuarioId: number | null = null;
  currentUser: UserResponse | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['es', 'en', 'fr', 'de']);
    this.translate.setDefaultLang('es');

    // SOLO ejecutar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('app_lang');
      if (savedLang) {
        this.translate.use(savedLang);
      }
    }
  }

  ngOnInit(): void {
    // Suscripción al estado del usuario
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
      this.usuarioId = user?.idUsuario || null;
    });
  }

  // ------------------------
  //    Menús y estados UI
  // ------------------------

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.perfilVisible = false;
    this.idiomasVisible = false;
  }

  togglePerfil() {
    this.perfilVisible = !this.perfilVisible;
    this.menuVisible = false;
    this.idiomasVisible = false;
  }

  toggleIdiomas() {
    this.idiomasVisible = !this.idiomasVisible;
    this.menuVisible = false;
    this.perfilVisible = false;
  }

  onMouseEnter() {
    this.menuVisible = true;
    this.perfilVisible = false;
    this.idiomasVisible = false;
  }

  onMouseLeave() {
    this.menuVisible = false;
    this.perfilVisible = false;
    this.idiomasVisible = false;
  }

  // ------------------------
  //    Cambio de idioma
  // ------------------------

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('app_lang', lang); // Guardar idioma
    this.idiomasVisible = false; // Cerrar menú
  }

  // ------------------------
  //       Login / Perfil
  // ------------------------

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  verReservas() {
    this.router.navigate(['/reservas', this.usuarioId]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { UserResponse } from '../../Models/UserResponse';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css'],
})
export class HeaderComponent implements OnInit {
  menuVisible = false;
  isLoggedIn = false;
  usuarioId: number | null = null;
  perfilVisible = false;
  currentUser: UserResponse | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de autenticación en tiempo real
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
      this.usuarioId = user?.idUsuario || null;
    });
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.perfilVisible = false;
  }
  togglePerfil() {
    this.perfilVisible = !this.perfilVisible;
    this.menuVisible = false;
  }

  onMouseEnter() {
    this.menuVisible = true;
    this.perfilVisible = false;
  }

  onMouseLeave() {
    this.menuVisible = false;
    this.perfilVisible = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  verReservas() {
    //Ir al componente de ver reservas (URL: reservas/{id})
    this.router.navigate(['/reservas', this.usuarioId]);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../generales-components/header-component/header-component';
import { AuthService } from '../../service/auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { LoginRequest } from '../../Models/LoginRequest';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    RouterOutlet,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMsg = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMsg = 'Por favor ingrese su correo y contraseña.';
      return;
    }

    this.loading = true;

    const loginRequest: LoginRequest = {
      correo: this.email,
      contrasena: this.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login exitoso:', response);

        // Redirigir según el rol usando los métodos del AuthService
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else if (this.authService.isOperador()) {
          this.router.navigate(['/operador']);
        } else if (this.authService.isCliente()) {
          // Redirigir a la página de reservas del cliente
          const userId = response.usuario.idUsuario;
          this.router.navigate(['/reservas', userId]);
        } else {
          // Fallback si no tiene ningún rol reconocido
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);
        this.errorMsg = 'Correo o contraseña incorrectos. Inténtelo nuevamente.';
      },
    });
  }
}

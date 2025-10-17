import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../generales-components/header-component/header-component';
import { UsuarioService } from '../../service/usuario/usuario-service';
import { RouterOutlet } from '@angular/router';
import { Usuario } from '../../Models/Usuario';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterOutlet, RouterModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onLogin() {
    this.errorMsg = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMsg = 'Por favor ingrese su correo y contraseña.';
      return;
    }

    this.loading = true;

    this.usuarioService.login(this.email, this.password).subscribe({
      next: (usuario: Usuario) => {
        this.loading = false;

        if (!usuario || !usuario.idUsuario) {
          this.errorMsg = 'Respuesta de login inválida.';
          return;
        }
        // Guarda los datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(usuario));

        const isAdmin = !!usuario.esAdministrador;
        const isOperador = !!usuario.esOperador;

        let targetUrl: any[] = [];

        if (isAdmin) {
          targetUrl = ['/admin/tiposHabitacion'];
        } else if (isOperador) {
          targetUrl = ['/operador'];
        } else {
          targetUrl = ['/perfil', usuario.idUsuario];
        }

        this.router.navigate(targetUrl).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);
        this.errorMsg = 'Correo o contraseña incorrectos. Inténtelo nuevamente.';
      },
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../generales-components/header-component/header-component';
import { UsuarioService } from '../../service/usuario/usuario-service';
import { Usuario } from '../../Models/Usuario';
import { RouterOutlet } from '@angular/router';

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

        if (!usuario) {
          this.errorMsg = 'Usuario no encontrado.';
          return;
        }

        // Guardar usuario en localStorage (para sesión)
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Normalizar valores booleanos (pueden venir null/undefined)
        const isAdmin = !!usuario.esAdministrador;
        const isOperador = !!usuario.esOperador;

        // Lógica de redirección según rol
        if (isAdmin) {
          this.router.navigate(['/admin/tiposHabitacion']);
        } else if (isOperador) {
          // elegí ruta admin/reservas para operadores según tu estructura previa
          this.router.navigate(['/admin/reservas']);
        } else {
          // si ambos son false o null → usuario normal
          this.router.navigate(['/reservas']);
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

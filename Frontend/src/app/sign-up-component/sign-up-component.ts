import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { FooterComponent } from '../generales-components/footer-component/footer-component';
import { Usuario } from '../Models/Usuario';
import { UsuarioService } from '../service/usuario/usuario-service';

@Component({
  selector: 'app-sign-up-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './sign-up-component.html',
  styleUrls: ['./sign-up-component.css'],
})
export class SignUpComponent {
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    cedula: '',
    telefono: '',
    idUsuario: 0,
    esOperador: false,
    esAdministrador: false,
    rol: '',
  };

  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onRegister() {
    this.successMsg = '';
    this.errorMsg = '';

    if (
      !this.usuario.nombre ||
      !this.usuario.apellido ||
      !this.usuario.correo ||
      !this.usuario.contrasena
    ) {
      this.errorMsg = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.usuarioService.createUsuario(this.usuario).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Usuario registrado exitosamente 🎉';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al registrar usuario:', err);
        this.errorMsg = 'Ocurrió un error al registrar. Intente nuevamente.';
      },
    });
  }
}

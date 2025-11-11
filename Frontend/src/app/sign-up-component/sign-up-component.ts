import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { FooterComponent } from '../generales-components/footer-component/footer-component';
import { RegisterRequest } from '../Models/RegisterRequest';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-sign-up-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './sign-up-component.html',
  styleUrls: ['./sign-up-component.css'],
})
export class SignUpComponent {
  registerData: RegisterRequest = {
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    cedula: '',
    telefono: ''
  };

  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.successMsg = '';
    this.errorMsg = '';

    if (
      !this.registerData.nombre ||
      !this.registerData.apellido ||
      !this.registerData.correo ||
      !this.registerData.contrasena
    ) {
      this.errorMsg = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMsg = 'Usuario registrado exitosamente 🎉';
        console.log('Registro exitoso:', response);
        // El usuario ya está autenticado automáticamente, redirigir a su dashboard
        setTimeout(() => {
          if (this.authService.isCliente()) {
            this.router.navigate(['/cliente']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al registrar usuario:', err);
        this.errorMsg = 'Ocurrió un error al registrar. Intente nuevamente.';
      },
    });
  }
}

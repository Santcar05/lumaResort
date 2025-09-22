import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../generales-components/header-component/header-component';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onLogin() {
    console.log('Iniciando sesión con:', this.email, this.password);
    // Aquí puedes conectar tu lógica de autenticación
  }
}

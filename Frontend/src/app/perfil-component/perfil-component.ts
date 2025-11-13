import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../service/cliente/cliente-service';
import { Usuario } from '../Models/Usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { AuthService } from '../service/auth/auth.service';
import { UserResponse } from '../Models/UserResponse';

@Component({
  selector: 'app-perfil-component',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './perfil-component.html',
  styleUrls: ['./perfil-component.css'],
})
export class PerfilComponent implements OnInit {
  usuario?: Usuario;
  modoEdicion: boolean = false;

  // ✅ Notificación
  mostrarNotificacion: boolean = false;
  mensajeNotificacion: string = '';
  tipoNotificacion: 'exito' | 'error' = 'exito';

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario autenticado desde AuthService
    const currentUser = this.authService.getUser();

    if (currentUser) {
      // Adaptar UserResponse a Usuario para el formulario
      this.usuario = {
        idUsuario: currentUser.idUsuario,
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        correo: currentUser.correo,
        telefono: currentUser.telefono,
        cedula: currentUser.cedula,
        contrasena: '', // No mostrar la contraseña
        rol: 'CLIENTE',
        esOperador: false,
        esAdministrador: false
      };
    } else {
      // Si no hay usuario autenticado, redirigir a login
      this.router.navigate(['/login']);
    }
  }

  activarEdicion(): void {
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
  }

  actualizarCliente(): void {
    if (this.usuario) {
      // Usar el nuevo endpoint de AuthService que actualiza el perfil del usuario autenticado
      const updateData = {
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        cedula: this.usuario.cedula,
        telefono: this.usuario.telefono
      };

      this.authService.updateProfile(updateData).subscribe({
        next: (userResponse: UserResponse) => {
          this.mostrarMensaje('✅ Perfil actualizado con éxito', 'exito');
          this.modoEdicion = false;

          // Actualizar el usuario en el componente con los datos del response
          this.usuario = {
            idUsuario: userResponse.idUsuario,
            nombre: userResponse.nombre,
            apellido: userResponse.apellido,
            correo: userResponse.correo,
            telefono: userResponse.telefono,
            cedula: userResponse.cedula,
            contrasena: '',
            rol: 'CLIENTE',
            esOperador: false,
            esAdministrador: false
          };
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
          this.mostrarMensaje('❌ Error al actualizar el perfil', 'error');
        },
      });
    }
  }

  // 🔔 Método para mostrar notificación
  mostrarMensaje(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    this.mensajeNotificacion = mensaje;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 2500);
  }
}

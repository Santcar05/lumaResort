import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../service/cliente/cliente-service';
import { Usuario } from '../Models/Usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../generales-components/header-component/header-component';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const idUsuario = this.route.snapshot.params['id'];
    if (idUsuario) {
      this.clienteService.findByUsuarioId(idUsuario).subscribe((data: Usuario) => {
        this.usuario = data;
      });
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
      this.clienteService.update(this.usuario).subscribe({
        next: () => {
          this.mostrarMensaje('✅ Perfil actualizado con éxito', 'exito');
          this.modoEdicion = false;
        },
        error: () => {
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

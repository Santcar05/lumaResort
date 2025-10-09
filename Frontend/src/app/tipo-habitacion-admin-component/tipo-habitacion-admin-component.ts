import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { TipoHabitacionService } from '../service/tipo-habitacion';
import { HabitacionService } from '../service/habitacion/habitacion-service';

@Component({
  selector: 'app-tipo-habitacion-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-habitacion-admin-component.html',
  styleUrl: './tipo-habitacion-admin-component.css',
})
export class TipoHabitacionAdminComponent {
  tipos: TipoHabitacion[] = [];
  nuevoTipo: TipoHabitacion = { id: 0, nombre: '', descripcion: '' };
  editando: TipoHabitacion | null = null;

  // Variables para mostrar notificaciones dentro de la pantalla
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(
    private tipoHabitacionService: TipoHabitacionService,
    private habitacionService: HabitacionService
  ) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.tipoHabitacionService.findAll().subscribe({
      next: (data) => (this.tipos = data),
      error: (err) => console.error('Error al cargar tipos de habitación:', err),
    });
  }

  crearTipo(): void {
    if (!this.nuevoTipo.nombre.trim() || !this.nuevoTipo.descripcion.trim()) return;

    this.tipoHabitacionService.create(this.nuevoTipo).subscribe({
      next: () => {
        this.cargarTiposHabitacion();
        this.nuevoTipo = { id: 0, nombre: '', descripcion: '' };
        this.mostrarMensaje('Tipo de habitación creado exitosamente.', 'success');
      },
      error: (err) => {
        console.error('Error al crear tipo de habitación:', err);
        this.mostrarMensaje('Error al crear el tipo de habitación.', 'error');
      },
    });
  }

  editarTipo(tipo: TipoHabitacion): void {
    this.editando = { ...tipo };
  }

  guardarEdicion(): void {
    if (!this.editando) return;

    this.tipoHabitacionService.update(this.editando).subscribe({
      next: () => {
        this.cargarTiposHabitacion();
        this.mostrarMensaje('Tipo de habitación actualizado exitosamente.', 'success');
        this.editando = null;
      },
      error: (err) => {
        console.error('Error al actualizar tipo de habitación:', err);
        this.mostrarMensaje('Error al actualizar el tipo de habitación.', 'error');
      },
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarTipo(id: number): void {
    // Paso 1: verificar si hay habitaciones asociadas
    this.habitacionService.findAll().subscribe({
      next: (habitaciones) => {
        const asociadas = habitaciones.filter((hab) => hab.tipoHabitacion?.id === id);

        if (asociadas.length > 0) {
          // Mensaje rojo dentro de la página
          this.mostrarMensaje(
            '❌ No se puede eliminar este tipo de habitación porque tiene habitaciones asociadas.',
            'error'
          );
          return;
        }

        // Eliminar sin confirm() externo, pero con notificación interna
        this.tipoHabitacionService.delete(id).subscribe({
          next: () => {
            this.cargarTiposHabitacion();
            this.mostrarMensaje('Tipo de habitación eliminado exitosamente.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar tipo de habitación:', err);
            this.mostrarMensaje('Error al eliminar el tipo de habitación.', 'error');
          },
        });
      },
      error: (err) => console.error('Error al verificar habitaciones:', err),
    });
  }

  // Método para mostrar mensajes por unos segundos
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;

    // Ocultar después de 4 segundos
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 4000);
  }
}

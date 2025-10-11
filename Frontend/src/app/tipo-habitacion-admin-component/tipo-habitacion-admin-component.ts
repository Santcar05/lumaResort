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
  styleUrls: ['./tipo-habitacion-admin-component.css'],
})
export class TipoHabitacionAdminComponent {
  tipos: TipoHabitacion[] = [];
  tiposFiltrados: TipoHabitacion[] = [];
  nuevoTipo: TipoHabitacion = { id: 0, nombre: '', descripcion: '' };
  editando: TipoHabitacion | null = null;

  filtroId: string = '';
  filtroNombre: string = '';

  // Modal
  modalAbierto: boolean = false;

  // Notificación flotante
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' = 'exito';

  constructor(
    private tipoHabitacionService: TipoHabitacionService,
    private habitacionService: HabitacionService
  ) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.tipoHabitacionService.findAll().subscribe({
      next: (data) => {
        this.tipos = data;
        this.tiposFiltrados = data;
      },
      error: () => this.mostrarMensaje('Error al cargar tipos de habitación', 'error'),
    });
  }

  filtrarTipos(): void {
    const idFiltro = this.filtroId.trim().toLowerCase();
    const nombreFiltro = this.filtroNombre.trim().toLowerCase();

    this.tiposFiltrados = this.tipos.filter((t) => {
      const coincideId = idFiltro ? t.id.toString().includes(idFiltro) : true;
      const coincideNombre = nombreFiltro ? t.nombre.toLowerCase().includes(nombreFiltro) : true;
      return coincideId && coincideNombre;
    });
  }

  limpiarFiltro(): void {
    this.filtroId = '';
    this.filtroNombre = '';
    this.tiposFiltrados = this.tipos;
  }

  // Modal
  abrirModal(): void {
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
    this.nuevoTipo = { id: 0, nombre: '', descripcion: '' };
  }

  // Notificación flotante
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;

    setTimeout(() => {
      this.mostrarNotificacion = false;
    }, 3000);
  }

  crearTipo(): void {
    if (!this.nuevoTipo.nombre.trim() || !this.nuevoTipo.descripcion.trim()) return;

    this.tipoHabitacionService.create(this.nuevoTipo).subscribe({
      next: () => {
        this.cargarTiposHabitacion();
        this.cerrarModal();
        this.mostrarMensaje('Tipo de habitación creado correctamente', 'exito');
      },
      error: () => this.mostrarMensaje('Error al crear tipo de habitación', 'error'),
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
        this.editando = null;
        this.mostrarMensaje('Tipo de habitación editado correctamente', 'exito');
      },
      error: () => this.mostrarMensaje('Error al editar tipo de habitación', 'error'),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarTipo(id: number): void {
    this.habitacionService.findAll().subscribe({
      next: (habitaciones) => {
        const asociadas = habitaciones.filter((hab) => hab.tipoHabitacion?.id === id);

        if (asociadas.length > 0) {
          this.mostrarMensaje(
            'No se puede eliminar: hay habitaciones asociadas a este tipo',
            'error'
          );
          return;
        }

        this.tipoHabitacionService.delete(id).subscribe({
          next: () => {
            this.cargarTiposHabitacion();
            this.mostrarMensaje('Tipo de habitación eliminado correctamente', 'exito');
          },
          error: () => this.mostrarMensaje('Error al eliminar tipo de habitación', 'error'),
        });
      },
      error: () => this.mostrarMensaje('Error al verificar habitaciones asociadas', 'error'),
    });
  }
}

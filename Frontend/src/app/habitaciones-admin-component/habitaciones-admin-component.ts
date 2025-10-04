import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habitacion } from '../Models/Habitacion';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { HabitacionService } from '../service/habitacion/habitacion-service';
import { TipoHabitacionService } from '../service/tipo-habitacion';

@Component({
  selector: 'app-habitaciones-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitaciones-admin-component.html',
  styleUrl: './habitaciones-admin-component.css',
})
export class HabitacionesAdminComponent {
  habitaciones: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];

  nuevaHabitacion: Habitacion = this.crearHabitacionVacia();
  editando: Habitacion | null = null;

  constructor(
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService
  ) {}

  ngOnInit(): void {
    this.cargarHabitaciones();
    this.cargarTiposHabitacion();
  }

  private crearHabitacionVacia(): Habitacion {
    return {
      idHabitacion: 0,
      numero: '',
      precioPorNoche: 0,
      estado: '',
      capacidad: 1,
      descripcion: '',
      tipoHabitacion: { id: 0, nombre: '', descripcion: '' },
    };
  }

  cargarHabitaciones() {
    this.habitacionService.findAll().subscribe({
      next: (data) => (this.habitaciones = data),
      error: (err) => console.error('Error al cargar habitaciones:', err),
    });
  }

  cargarTiposHabitacion() {
    this.tipoHabitacionService.findAll().subscribe({
      next: (data) => (this.tiposHabitacion = data),
      error: (err) => console.error('Error al cargar tipos de habitación:', err),
    });
  }

  crearHabitacion() {
    if (
      !this.nuevaHabitacion.numero.trim() ||
      !this.nuevaHabitacion.estado.trim() ||
      !this.nuevaHabitacion.tipoHabitacion?.id
    )
      return;

    // Clonar sin el idHabitacion antes de enviar
    const habitacionSinId = { ...this.nuevaHabitacion };
    delete habitacionSinId.idHabitacion;

    this.habitacionService.create(habitacionSinId).subscribe({
      next: () => {
        this.cargarHabitaciones();
        this.nuevaHabitacion = this.crearHabitacionVacia();
      },
      error: (err) => console.error('Error al crear habitación:', err),
    });
  }

  editarHabitacion(habitacion: Habitacion) {
    this.editando = {
      ...habitacion,
      tipoHabitacion: habitacion.tipoHabitacion
        ? { ...habitacion.tipoHabitacion }
        : { id: 0, nombre: '', descripcion: '' },
    };
  }

  guardarEdicion() {
    if (!this.editando) return;

    this.habitacionService.update(this.editando).subscribe({
      next: () => {
        this.cargarHabitaciones();
        this.editando = null;
      },
      error: (err) => console.error('Error al actualizar habitación:', err),
    });
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarHabitacion(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta habitación?')) {
      this.habitacionService.delete(id).subscribe({
        next: () => this.cargarHabitaciones(),
        error: (err) => console.error('Error al eliminar habitación:', err),
      });
    }
  }
}

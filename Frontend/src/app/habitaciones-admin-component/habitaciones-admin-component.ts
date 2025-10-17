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
  styleUrls: ['./habitaciones-admin-component.css'],
})
export class HabitacionesAdminComponent {
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];

  nuevaHabitacion: Habitacion = this.crearHabitacionVacia();
  editando: Habitacion | null = null;

  // Filtros
  filtroBusqueda: string = '';
  categoriaBusqueda: string = 'tipo'; // valores posibles: 'id', 'numero', 'tipo'
  filtroEstado: string = '';

  // Control del modal
  modalAbierto: boolean = false;

  // Control de notificación flotante
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' = 'exito';

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
      next: (data) => {
        this.habitaciones = data;
        this.habitacionesFiltradas = data;
      },
      error: () => this.mostrarMensaje('Error al cargar habitaciones', 'error'),
    });
  }

  cargarTiposHabitacion() {
    this.tipoHabitacionService.findAll().subscribe({
      next: (data) => (this.tiposHabitacion = data),
      error: () => this.mostrarMensaje('Error al cargar tipos de habitación', 'error'),
    });
  }

  filtrarHabitaciones() {
    const filtro = this.filtroBusqueda.toLowerCase().trim();
    const estadoSeleccionado = this.filtroEstado.toLowerCase().trim();

    this.habitacionesFiltradas = this.habitaciones.filter((h) => {
      const tipoNombre = h.tipoHabitacion?.nombre?.toLowerCase() || '';
      const id = h.idHabitacion?.toString() || '';
      const numero = h.numero.toLowerCase();
      const estadoHabitacion = h.estado.toLowerCase().trim();

      let coincideCategoria = false;

      // Filtro por categoría seleccionada
      if (this.categoriaBusqueda === 'id') {
        coincideCategoria = id.includes(filtro);
      } else if (this.categoriaBusqueda === 'numero') {
        coincideCategoria = numero.includes(filtro);
      } else if (this.categoriaBusqueda === 'tipo') {
        coincideCategoria = tipoNombre.includes(filtro);
      }

      // Filtro por estado exacto (solo si hay uno seleccionado)
      const coincideEstado =
        !estadoSeleccionado ||
        estadoHabitacion === estadoSeleccionado ||
        (estadoSeleccionado === 'ocupado' && estadoHabitacion === 'ocupada') ||
        (estadoSeleccionado === 'ocupada' && estadoHabitacion === 'ocupado');

      return coincideCategoria && coincideEstado;
    });
  }

  limpiarFiltro() {
    this.filtroBusqueda = '';
    this.categoriaBusqueda = 'tipo';
    this.filtroEstado = '';
    this.habitacionesFiltradas = this.habitaciones;
  }

  // Modal
  abrirModal() {
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
    this.nuevaHabitacion = this.crearHabitacionVacia();
  }

  // Notificación flotante
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito') {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;

    setTimeout(() => {
      this.mostrarNotificacion = false;
    }, 2500);
  }

  crearHabitacion() {
    if (
      !this.nuevaHabitacion.numero.trim() ||
      !this.nuevaHabitacion.estado.trim() ||
      !this.nuevaHabitacion.tipoHabitacion?.id
    )
      return;

    const habitacionSinId = { ...this.nuevaHabitacion };
    delete habitacionSinId.idHabitacion;

    this.habitacionService.create(habitacionSinId).subscribe({
      next: () => {
        this.cargarHabitaciones();
        this.cerrarModal();
        this.mostrarMensaje('Habitación creada correctamente');
      },
      error: () => this.mostrarMensaje('Error al crear habitación', 'error'),
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
        this.mostrarMensaje('Habitación editada correctamente');
      },
      error: () => this.mostrarMensaje('Error al editar habitación', 'error'),
    });
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarHabitacion(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta habitación?')) {
      this.habitacionService.delete(id).subscribe({
        next: () => {
          this.cargarHabitaciones();
          this.mostrarMensaje('Habitación eliminada correctamente');
        },
        error: () => this.mostrarMensaje('Error al eliminar habitación', 'error'),
      });
    }
  }
}

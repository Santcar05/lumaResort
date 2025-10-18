import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../Models/Servicio';
import { Reserva } from '../Models/Reserva';
import { CRUDServiciosService } from '../service/servicios/CRUD/crudservicios-service';
import { ReservaService } from '../service/reserva/reserva-service';
import { Habitacion } from '../Models/Habitacion';

@Component({
  selector: 'app-servicios-operador-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-operador-component.html',
  styleUrls: ['./servicios-operador-component.css'],
})
export class ServiciosOperadorComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  reservas: Reserva[] = [];

  // Filtros
  filtroId: string = '';
  filtroNombre: string = '';
  filtroTipo: string = 'TODOS';
  tipos: string[] = [
    'TODOS',
    'RESTAURANTE',
    'SPA',
    'LAVANDERIA',
    'TRANSPORTE',
    'ENTRETENIMIENTO',
    'OTROS',
  ];

  // Modales
  modalContratarAbierto: boolean = false;
  modalEliminarDeReservaAbierto: boolean = false;

  servicioAContratar: Servicio | null = null;
  servicioAEliminarDeReserva: Servicio | null = null;

  // Datos para eliminar de reserva
  reservasConServicio: Reserva[] = [];
  reservaSeleccionadaId: number | null = null;
  reservaSeleccionada: Reserva | null = null;

  habitacionId: number | null = null;

  // Notificación
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' | 'info' = 'exito';

  constructor(
    private serviciosService: CRUDServiciosService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarReservas();
  }

  cargarServicios(): void {
    this.serviciosService.findAll().subscribe({
      next: (data) => {
        this.servicios = data;
        this.serviciosFiltrados = data;
        this.mostrarMensaje(`${data.length} servicios cargados correctamente`, 'info');
      },
      error: () => this.mostrarMensaje('Error al cargar los servicios', 'error'),
    });
  }

  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: () => console.error('Error al cargar las reservas'),
    });
  }

  // Obtener reservas que tienen un servicio específico
  getReservasConServicio(servicioId: number): Reserva[] {
    return this.reservas.filter((reserva) =>
      reserva.servicios?.some((servicio) => servicio.idServicio === servicioId)
    );
  }

  abrirModalEliminarDeReserva(servicio: Servicio): void {
    this.servicioAEliminarDeReserva = servicio;
    this.reservasConServicio = this.getReservasConServicio(servicio.idServicio);
    this.reservaSeleccionadaId = null;
    this.reservaSeleccionada = null;
    this.modalEliminarDeReservaAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalEliminarDeReserva(): void {
    this.modalEliminarDeReservaAbierto = false;
    this.servicioAEliminarDeReserva = null;
    this.reservasConServicio = [];
    this.reservaSeleccionadaId = null;
    this.reservaSeleccionada = null;
    document.body.style.overflow = 'auto';
  }

  onReservaSeleccionadaChange(): void {
    if (this.reservaSeleccionadaId) {
      const id = Number(this.reservaSeleccionadaId);
      this.reservaSeleccionada = this.reservas.find((r) => r.idReserva === id) || null;
    } else {
      this.reservaSeleccionada = null;
    }
  }

  eliminarServicioDeReserva(): void {
    if (!this.servicioAEliminarDeReserva || !this.reservaSeleccionada) {
      this.mostrarMensaje('Por favor seleccione una reserva', 'error');
      return;
    }

    // Simular eliminación del servicio de la reserva
    console.log('Eliminando servicio de reserva:', {
      servicio: this.servicioAEliminarDeReserva,
      reserva: this.reservaSeleccionada,
    });

    this.reservaService
      .removerServicio(
        this.reservaSeleccionada.idReserva,
        this.servicioAEliminarDeReserva.idServicio
      )
      .subscribe({
        next: () => {
          this.mostrarMensaje(
            `Servicio "${this.servicioAEliminarDeReserva!.nombre}" eliminado de la reserva #${
              this.reservaSeleccionada!.idReserva
            }`,
            'exito'
          );
          this.cerrarModalEliminarDeReserva();
          this.cargarReservas();
        },
        error: () => {
          this.mostrarMensaje('Error al eliminar el servicio de la reserva', 'error');
        },
      });
  }

  // Métodos existentes (sin cambios)
  filtrarServicios(): void {
    const idFiltro = this.filtroId.trim().toLowerCase();
    const nombreFiltro = this.filtroNombre.trim().toLowerCase();
    const tipoFiltro = this.filtroTipo;

    this.serviciosFiltrados = this.servicios.filter((servicio) => {
      const coincideId = idFiltro ? servicio.idServicio.toString().includes(idFiltro) : true;
      const coincideNombre = nombreFiltro
        ? servicio.nombre.toLowerCase().includes(nombreFiltro)
        : true;
      const coincideTipo = tipoFiltro === 'TODOS' ? true : servicio.tipo === tipoFiltro;
      return coincideId && coincideNombre && coincideTipo;
    });
  }

  limpiarFiltros(): void {
    this.filtroId = '';
    this.filtroNombre = '';
    this.filtroTipo = 'TODOS';
    this.serviciosFiltrados = this.servicios;
  }

  habitacionesDisponibles: Habitacion[] = [];
  abrirModalContratar(servicio: Servicio): void {
    this.reservaService.getHabitacionesDisponibles(servicio.idServicio).subscribe({
      next: (habitaciones) => {
        this.habitacionesDisponibles = habitaciones;
      },
      error: (err) => {
        console.error('Error al obtener habitaciones disponibles', err);
      },
    });

    this.servicioAContratar = servicio;
    this.modalContratarAbierto = true;
    this.habitacionId = null;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalContratar(): void {
    this.modalContratarAbierto = false;
    this.servicioAContratar = null;
    document.body.style.overflow = 'auto';
  }

  contratarServicio(): void {
    if (!this.servicioAContratar || !this.habitacionId) {
      this.mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
      return;
    }
    //Logica para contratar un servicio a una reserva existente
    this.reservaService
      .contratarServicio(this.servicioAContratar.idServicio, this.habitacionId)
      .subscribe({
        next: () => {
          this.mostrarMensaje('Servicio contratado correctamente', 'exito');
          this.cerrarModalContratar();
          this.cargarReservas();
        },
        error: () => {
          this.mostrarMensaje('Error al contratar el servicio', 'error');
        },
      });

    this.cerrarModalContratar();
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'info' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 4000);
  }

  getTipoClass(tipo: string): string {
    const clases = {
      RESTAURANTE: 'tipo-restaurante',
      SPA: 'tipo-spa',
      LAVANDERIA: 'tipo-lavanderia',
      TRANSPORTE: 'tipo-transporte',
      ENTRETENIMIENTO: 'tipo-entretenimiento',
      OTROS: 'tipo-otros',
    };
    return clases[tipo as keyof typeof clases] || 'tipo-default';
  }

  getTipoIcon(tipo: string): string {
    const iconos = {
      RESTAURANTE: '🍽️',
      SPA: '🧖‍♀️',
      LAVANDERIA: '👔',
      TRANSPORTE: '🚗',
      ENTRETENIMIENTO: '🎮',
      OTROS: '🔧',
    };
    return iconos[tipo as keyof typeof iconos] || '📋';
  }

  getEstadoClass(estado: string): string {
    const clases = {
      PENDIENTE: 'estado-pendiente',
      CONFIRMADA: 'estado-confirmada',
      ACTIVA: 'estado-activa',
      CANCELADA: 'estado-cancelada',
      FINALIZADA: 'estado-finalizada',
    };
    return clases[estado as keyof typeof clases] || 'estado-default';
  }

  formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString('es-ES')}`;
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  getPromedioCalificacion(servicio: Servicio): number {
    if (!servicio.comentarios || servicio.comentarios.length === 0) return 0;
    const suma = servicio.comentarios.reduce(
      (acc, comentario) => acc + (comentario.calificacion || 0),
      0
    );
    return suma / servicio.comentarios.length;
  }

  getCalificacionEstrellas(calificacion: number): string {
    const c = Math.min(5, Math.max(0, Math.round(calificacion)));
    return '★'.repeat(c) + '☆'.repeat(5 - c);
  }
}

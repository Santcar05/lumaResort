import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../Models/Reserva';
import { ReservaService } from '../service/reserva/reserva-service';

@Component({
  selector: 'app-reservas-operador-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-operador-component.html',
  styleUrls: ['./reservas-operador-component.css'],
})
export class ReservasOperadorComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];

  // Filtros
  filtroId: string = '';
  filtroEstado: string = 'Todas';
  estados: string[] = ['Todas', 'Pendiente', 'Confirmada', 'Activa', 'Cancelada', 'Finalizada'];

  // Reserva seleccionada para eliminar
  reservaAEliminar: Reserva | null = null;

  // Notificación
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' | 'info' = 'exito';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
        this.mostrarMensaje(`${data.length} reservas cargadas correctamente`, 'info');
      },
      error: () => this.mostrarMensaje('Error al cargar las reservas', 'error'),
    });
  }

  filtrarReservas(): void {
    const idFiltro = this.filtroId.trim().toLowerCase();
    const estadoFiltro = this.filtroEstado;

    this.reservasFiltradas = this.reservas.filter((reserva) => {
      const coincideId = idFiltro ? reserva.idReserva.toString().includes(idFiltro) : true;

      const coincideEstado = estadoFiltro === 'Todas' ? true : reserva.estado === estadoFiltro;

      return coincideId && coincideEstado;
    });
  }

  limpiarFiltros(): void {
    this.filtroId = '';
    this.filtroEstado = 'Todas';
    this.reservasFiltradas = this.reservas;
  }

  confirmarEliminacion(reserva: Reserva): void {
    this.reservaAEliminar = reserva;
  }

  cancelarEliminacion(): void {
    this.reservaAEliminar = null;
  }

  eliminarReserva(): void {
    if (!this.reservaAEliminar) return;

    this.reservaService.delete(this.reservaAEliminar.idReserva).subscribe({
      next: () => {
        this.cargarReservas();
        this.reservaAEliminar = null;
        this.mostrarMensaje('Reserva eliminada correctamente', 'exito');
      },
      error: () => {
        this.mostrarMensaje('Error al eliminar la reserva', 'error');
        this.reservaAEliminar = null;
      },
    });
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'info' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;

    setTimeout(() => {
      this.mostrarNotificacion = false;
    }, 4000);
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

  getEstadoIcon(estado: string): string {
    const iconos = {
      PENDIENTE: '⏳',
      CONFIRMADA: '✅',
      ACTIVA: '🏨',
      CANCELADA: '❌',
      FINALIZADA: '🏁',
    };
    return iconos[estado as keyof typeof iconos] || '📋';
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}

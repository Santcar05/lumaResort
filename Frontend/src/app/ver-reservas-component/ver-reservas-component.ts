import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { Reserva } from '../Models/Reserva';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ver-reservas-component',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './ver-reservas-component.html',
  styleUrls: ['./ver-reservas-component.css'],
})
export class VerReservasComponent implements OnInit {
  loading = true;
  errorMsg = '';
  reservas: Reserva[] = [];
  usuarioId: number | null = null;

  // Variables para la actualización de reserva
  mostrarCalendarioActualizar = false;
  reservaAActualizar: Reserva | null = null;
  nuevaFechaInicio: string = '';
  nuevaFechaFin: string = '';
  fechaMinima: string = '';
  procesandoActualizacion = false;

  private baseUrlReservas = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient, private router: Router) {
    const today = new Date();
    this.fechaMinima = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuario = JSON.parse(userData);
      if (usuario && usuario.idUsuario) {
        this.usuarioId = usuario.idUsuario;
        this.cargarReservas();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarReservas(): void {
    this.loading = true;
    this.errorMsg = '';

    this.http
      .get<Reserva[]>(`${this.baseUrlReservas}/buscar/${this.usuarioId}`)
      .pipe(
        catchError((err) => {
          console.error('Error al obtener reservas:', err);
          this.errorMsg =
            'No se pudieron cargar tus reservas. Verifica la conexión con el servidor.';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.reservas = data;
        this.loading = false;
      });
  }

  cancelarReserva(idReserva: number): void {
    const confirmar = confirm('¿Seguro que deseas cancelar esta reserva?');
    if (!confirmar) return;

    this.http
      .put(`${this.baseUrlReservas}/cancelar/${idReserva}`, {}, { responseType: 'text' })
      .pipe(
        catchError((err) => {
          console.error('Error al cancelar reserva:', err);
          alert('No se pudo cancelar la reserva. Inténtalo más tarde.');
          return of(null);
        })
      )
      .subscribe((resp) => {
        if (resp !== null) {
          alert('Reserva cancelada correctamente');
          this.cargarReservas();
        }
      });
  }

  // Nueva función para abrir el calendario de actualización
  abrirCalendarioActualizar(reserva: Reserva): void {
    this.reservaAActualizar = reserva;
    this.nuevaFechaInicio = this.formatoFechaParaInput(reserva.fechaInicio);
    this.nuevaFechaFin = this.formatoFechaParaInput(reserva.fechaFin);
    this.mostrarCalendarioActualizar = true;
  }

  // Nueva función para cerrar el calendario de actualización
  cerrarCalendarioActualizar(): void {
    this.mostrarCalendarioActualizar = false;
    this.reservaAActualizar = null;
    this.nuevaFechaInicio = '';
    this.nuevaFechaFin = '';
    this.procesandoActualizacion = false;
  }

  // Nueva función para validar fechas al actualizar
  validarFechasActualizar(): void {
    if (this.nuevaFechaInicio && this.nuevaFechaFin) {
      const inicio = new Date(this.nuevaFechaInicio);
      const fin = new Date(this.nuevaFechaFin);

      if (fin <= inicio) {
        const nuevaFecha = new Date(inicio);
        nuevaFecha.setDate(nuevaFecha.getDate() + 1);
        this.nuevaFechaFin = nuevaFecha.toISOString().split('T')[0];
      }
    }
  }

  // Nueva función para calcular días de estancia
  get diasEstanciaActualizar(): number {
    if (!this.nuevaFechaInicio || !this.nuevaFechaFin) return 0;
    const inicio = new Date(this.nuevaFechaInicio);
    const fin = new Date(this.nuevaFechaFin);
    return Math.max(0, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
  }

  // Nueva función para actualizar la reserva
  actualizarReserva(): void {
    if (!this.reservaAActualizar || this.procesandoActualizacion) return;

    const confirmar = confirm(`¿Seguro que deseas actualizar las fechas de esta reserva?
    
Fecha anterior: ${this.formatoFecha(this.reservaAActualizar.fechaInicio)} - ${this.formatoFecha(
      this.reservaAActualizar.fechaFin
    )}
Nueva fecha: ${this.formatoFecha(this.nuevaFechaInicio)} - ${this.formatoFecha(
      this.nuevaFechaFin
    )}`);

    if (!confirmar) return;

    this.procesandoActualizacion = true;

    const reservaActualizada = {
      ...this.reservaAActualizar,
      fechaInicio: this.nuevaFechaInicio,
      fechaFin: this.nuevaFechaFin,
    };

    this.http
      .put(
        `${this.baseUrlReservas}/actualizar/${this.reservaAActualizar.idReserva}`,
        reservaActualizada
      )
      .pipe(
        catchError((err) => {
          console.error('Error al actualizar reserva:', err);
          alert('No se pudo actualizar la reserva. Inténtalo más tarde.');
          this.procesandoActualizacion = false;
          return of(null);
        })
      )
      .subscribe((resp: any) => {
        this.procesandoActualizacion = false;
        if (resp) {
          alert('Reserva actualizada correctamente');
          this.cerrarCalendarioActualizar();
          this.cargarReservas();
        }
      });
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  getEstadoClase(estado: string): string {
    const e = estado.toLowerCase();
    if (e.includes('cancelada')) return 'estado-cancelada';
    if (e.includes('pendiente')) return 'estado-pendiente';
    if (e.includes('confirmada')) return 'estado-confirmada';
    return 'estado-otro';
  }

  formatoFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // Función auxiliar para formatear fecha para input type="date"
  private formatoFechaParaInput(fecha: string | Date): string {
    return new Date(fecha).toISOString().split('T')[0];
  }
}

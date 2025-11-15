import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { Reserva } from '../Models/Reserva';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../service/reserva/reserva-service';
import { AuthService } from '../service/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-ver-reservas-component',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, TranslateModule],
  templateUrl: './ver-reservas-component.html',
  styleUrls: ['./ver-reservas-component.css'],
})
export class VerReservasComponent implements OnInit {
  loading = true;
  errorMsg = '';
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  usuarioId: number | null = null;

  // Variables para la actualización de reserva
  mostrarCalendarioActualizar = false;
  reservaAActualizar: Reserva | null = null;
  nuevaFechaInicio: string = '';
  nuevaFechaFin: string = '';
  fechaMinima: string = '';
  procesandoActualizacion = false;

  // Variables para el filtro (basado en reserva-component)
  filtroEstado: string = 'TODAS';

  private baseUrlReservas = 'http://localhost:8080/reservas';

  constructor(
    private http: HttpClient,
    private router: Router,
    private reservaService: ReservaService,
    private authService: AuthService
  ) {
    const today = new Date();
    this.fechaMinima = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Usar AuthService para obtener el usuario autenticado
    const usuario = this.authService.getUser();
    if (usuario && usuario.idUsuario) {
      this.usuarioId = usuario.idUsuario;
      this.cargarReservas();
    } else {
      // Si no hay usuario autenticado, redirigir a login
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
        this.aplicarFiltro();
        this.loading = false;
      });
  }

  // Métodos para el filtro
  aplicarFiltro(): void {
    if (this.filtroEstado === 'TODAS') {
      this.reservasFiltradas = [...this.reservas];
    } else {
      this.reservasFiltradas = this.reservas.filter(
        (reserva) => reserva.estado && reserva.estado.toUpperCase() === this.filtroEstado
      );
    }
  }

  cambiarFiltro(nuevoFiltro: string): void {
    this.filtroEstado = nuevoFiltro;
    this.aplicarFiltro();
  }

  cancelarReserva(idReserva: number): void {
    const confirmar = confirm('¿Seguro que deseas cancelar esta reserva?');
    if (!confirmar) return;

    this.reservaService
      .cancelarReserva(idReserva)
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

  abrirCalendarioActualizar(reserva: Reserva): void {
    this.reservaAActualizar = reserva;
    this.nuevaFechaInicio = this.formatoFechaParaInput(reserva.fechaInicio);
    this.nuevaFechaFin = this.formatoFechaParaInput(reserva.fechaFin);
    this.mostrarCalendarioActualizar = true;
  }

  cerrarCalendarioActualizar(): void {
    this.mostrarCalendarioActualizar = false;
    this.reservaAActualizar = null;
    this.nuevaFechaInicio = '';
    this.nuevaFechaFin = '';
    this.procesandoActualizacion = false;
  }

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

  get diasEstanciaActualizar(): number {
    if (!this.nuevaFechaInicio || !this.nuevaFechaFin) return 0;
    const inicio = new Date(this.nuevaFechaInicio);
    const fin = new Date(this.nuevaFechaFin);
    return Math.max(0, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
  }

  actualizarReserva(): void {
    if (!this.reservaAActualizar || this.procesandoActualizacion) return;

    const confirmar = confirm(
      `¿Seguro que deseas actualizar las fechas de esta reserva?\n\nFecha anterior: ${this.formatoFecha(
        this.reservaAActualizar.fechaInicio
      )} - ${this.formatoFecha(this.reservaAActualizar.fechaFin)}\nNueva fecha: ${this.formatoFecha(
        this.nuevaFechaInicio
      )} - ${this.formatoFecha(this.nuevaFechaFin)}`
    );

    if (!confirmar) return;

    this.procesandoActualizacion = true;

    const fechaInicioDate = new Date(this.nuevaFechaInicio);
    const fechaFinDate = new Date(this.nuevaFechaFin);

    const reservaActualizada = {
      fechaInicio: fechaInicioDate,
      fechaFin: fechaFinDate,
      cantidadPersonas: this.reservaAActualizar.cantidadPersonas,
      estado: this.reservaAActualizar.estado,
      idUsuario: this.reservaAActualizar.usuario?.idUsuario,
      idHabitacion: this.reservaAActualizar.habitacion?.idHabitacion,
    };

    console.log('=== DEBUG ACTUALIZACIÓN ===');
    console.log('ID Reserva:', this.reservaAActualizar.idReserva);
    console.log('Datos enviados:', reservaActualizada);

    this.reservaService
      .actualizarReserva(this.reservaAActualizar.idReserva, reservaActualizada)
      .pipe(
        catchError((err) => {
          console.error('=== ERROR COMPLETO ===', err);
          console.error('Status:', err.status);
          console.error('URL:', err.url);

          let errorMsg = 'No se pudo actualizar la reserva. Inténtalo más tarde.';
          if (err.error) {
            if (typeof err.error === 'string') {
              errorMsg = err.error;
            } else if (err.error.message) {
              errorMsg = err.error.message;
            } else if (err.error.error) {
              errorMsg = err.error.error;
            }
          }

          alert('Error: ' + errorMsg);
          this.procesandoActualizacion = false;
          return of(null);
        })
      )
      .subscribe((resp: any) => {
        console.log('=== RESPUESTA DEL SERVIDOR ===', resp);
        this.procesandoActualizacion = false;

        if (resp) {
          if (typeof resp === 'string') {
            console.log('Respuesta del servidor (texto):', resp);
            alert('Reserva actualizada correctamente');
            this.cerrarCalendarioActualizar();
            this.cargarReservas();
          } else if (resp.success !== false) {
            console.log('Respuesta del servidor (JSON):', resp);
            alert(resp.message || 'Reserva actualizada correctamente');
            this.cerrarCalendarioActualizar();
            this.cargarReservas();
          } else {
            alert(resp.message || 'Error al actualizar la reserva');
          }
        } else {
          console.log('Respuesta vacía o nula del servidor');
          alert('No se recibió respuesta del servidor');
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
    if (e.includes('finalizada')) return 'estado-finalizada';
    return 'estado-otro';
  }

  formatoFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private formatoFechaParaInput(fecha: string | Date): string {
    return new Date(fecha).toISOString().split('T')[0];
  }
}

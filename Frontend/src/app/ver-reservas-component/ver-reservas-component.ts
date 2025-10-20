import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { Reserva } from '../Models/Reserva';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-ver-reservas-component',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './ver-reservas-component.html',
  styleUrls: ['./ver-reservas-component.css'],
})
export class VerReservasComponent implements OnInit {
  loading = true;
  errorMsg = '';
  reservas: Reserva[] = [];
  usuarioId: number | null = null;

  private baseUrlReservas = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient, private router: Router) {}

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
      .put(`${this.baseUrlReservas}/cancelar/${idReserva}`, null)
      .pipe(
        catchError((err) => {
          console.error('Error al cancelar reserva:', err);
          alert('No se pudo cancelar la reserva. Inténtalo más tarde.');
          return of(null);
        })
      )
      .subscribe((resp) => {
        if (resp !== null) {
          alert('Reserva cancelada correctamente ✅');
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
}

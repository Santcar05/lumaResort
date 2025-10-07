import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Reserva } from '../Models/Reserva';
import { Habitacion } from '../Models/Habitacion';
import { Servicio } from '../Models/Servicio';
import { Usuario } from '../Models/Usuario';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-component.html',
  styleUrls: ['./reservas-component.css'],
})
export class ReservasComponent implements OnInit {
  // Datos del formulario
  fechaInicio: string = '';
  fechaFin: string = '';
  cantidadPersonas: number = 2;
  fechaMinima: string = '';

  // Datos cargados
  habitaciones: Habitacion[] = [];
  servicios: Servicio[] = [];

  // Selecciones
  habitacionSeleccionada: Habitacion | null = null;
  serviciosSeleccionados: Servicio[] = [];

  // Estados
  loading = true;
  errorMsg = '';
  procesando = false;
  mostrarExito = false;
  reservaCreada: Reserva | null = null;

  // URLs del backend
  private baseUrlReservas = 'http://localhost:8080/reservas';
  private baseUrlHabitaciones = 'http://localhost:8080/habitaciones';
  private baseUrlServicios = 'http://localhost:8080/servicios';

  // Usuario simulado (reemplaza con el usuario autenticado de tu sistema)
  private usuarioActual: Usuario = {
    idUsuario: 1,
    nombre: 'Usuario',
    apellido: 'Demo',
    correo: 'usuario@demo.com',
    telefono: '1234567890',
    rol: 'CLIENTE',
    contrasena: '',
    cedula: '',
    esOperador: false,
    esAdministrador: false,
  };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // Establecer fecha mínima como hoy
    const today = new Date();
    this.fechaMinima = today.toISOString().split('T')[0];

    // Inicializar fechas por defecto
    this.fechaInicio = this.fechaMinima;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.fechaFin = tomorrow.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Cargar habitaciones y servicios
   */
  cargarDatos(): void {
    this.loading = true;
    this.errorMsg = '';

    forkJoin({
      habitaciones: this.http.get<Habitacion[]>(this.baseUrlHabitaciones),
      servicios: this.http.get<Servicio[]>(this.baseUrlServicios),
    }).subscribe({
      next: (data) => {
        this.habitaciones = data.habitaciones.filter((h) => h.estado === 'Disponible');
        this.servicios = data.servicios;
        this.loading = false;

        if (this.habitaciones.length === 0 && this.servicios.length === 0) {
          this.errorMsg = 'No hay datos disponibles en este momento';
        }
      },
      error: (err) => {
        console.error('Error general:', err);
        this.errorMsg =
          'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        this.loading = false;
      },
    });
  }

  /**
   * Validar que la fecha de fin sea posterior a la de inicio
   */
  validarFechas(): void {
    if (this.fechaInicio && this.fechaFin) {
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);

      if (fin <= inicio) {
        const nuevaFecha = new Date(inicio);
        nuevaFecha.setDate(nuevaFecha.getDate() + 1);
        this.fechaFin = nuevaFecha.toISOString().split('T')[0];
      }
    }
  }

  /**
   * Calcular días de estancia
   */
  get diasEstancia(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    const diffTime = fin.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Incrementar cantidad de personas
   */
  incrementarPersonas(): void {
    if (this.cantidadPersonas < 10) {
      this.cantidadPersonas++;
    }
  }

  /**
   * Decrementar cantidad de personas
   */
  decrementarPersonas(): void {
    if (this.cantidadPersonas > 1) {
      this.cantidadPersonas--;
    }
  }

  /**
   * Seleccionar habitación
   */
  seleccionarHabitacion(habitacion: Habitacion): void {
    // No permitir seleccionar si no tiene capacidad suficiente
    if (habitacion.capacidad < this.cantidadPersonas) {
      return;
    }

    if (this.habitacionSeleccionada?.idHabitacion === habitacion.idHabitacion) {
      this.habitacionSeleccionada = null;
    } else {
      this.habitacionSeleccionada = habitacion;
    }
  }

  /**
   * Verificar si un servicio está seleccionado
   */
  isServicioSeleccionado(idServicio: number): boolean {
    return this.serviciosSeleccionados.some((s) => s.idServicio === idServicio);
  }

  /**
   * Toggle selección de servicio
   */
  toggleServicio(servicio: Servicio): void {
    const index = this.serviciosSeleccionados.findIndex(
      (s) => s.idServicio === servicio.idServicio
    );

    if (index > -1) {
      this.serviciosSeleccionados.splice(index, 1);
    } else {
      this.serviciosSeleccionados.push(servicio);
    }
  }

  /**
   * Calcular subtotal de habitación
   */
  calcularSubtotalHabitacion(): number {
    if (!this.habitacionSeleccionada || this.diasEstancia <= 0) return 0;
    return this.habitacionSeleccionada.precioPorNoche * this.diasEstancia;
  }

  /**
   * Calcular subtotal de servicios
   */
  calcularSubtotalServicios(): number {
    return this.serviciosSeleccionados.reduce((total, s) => total + s.precio, 0);
  }

  /**
   * Calcular total
   */
  calcularTotal(): number {
    return this.calcularSubtotalHabitacion() + this.calcularSubtotalServicios();
  }

  /**
   * Verificar si se puede realizar la reserva
   */
  puedeReservar(): boolean {
    return !!(
      this.fechaInicio &&
      this.fechaFin &&
      this.diasEstancia > 0 &&
      this.habitacionSeleccionada &&
      this.cantidadPersonas > 0
    );
  }

  /**
   * Realizar la reserva
   */
  realizarReserva(): void {
    if (!this.puedeReservar() || this.procesando) {
      return;
    }

    this.procesando = true;

    const reserva: Partial<Reserva> = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      cantidadPersonas: this.cantidadPersonas,
      estado: 'CONFIRMADA',
      cliente: this.usuarioActual,
      habitacion: this.habitacionSeleccionada!,
      servicios: this.serviciosSeleccionados,
    };

    this.http
      .post<Reserva>(this.baseUrlReservas, reserva)
      .pipe(
        catchError((err) => {
          console.error('Error al crear reserva:', err);
          this.errorMsg = 'Error al procesar la reserva. Por favor intenta nuevamente.';
          this.procesando = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.procesando = false;

        if (response) {
          this.reservaCreada = response;
          this.mostrarExito = true;
        }
      });
  }

  /**
   * Limpiar formulario
   */
  limpiarFormulario(): void {
    const today = new Date();
    this.fechaInicio = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.fechaFin = tomorrow.toISOString().split('T')[0];

    this.cantidadPersonas = 2;
    this.habitacionSeleccionada = null;
    this.serviciosSeleccionados = [];
  }

  /**
   * Cerrar modal de éxito
   */
  cerrarModal(): void {
    this.mostrarExito = false;
    this.limpiarFormulario();
    // Opcional: redirigir a otra página
    // this.router.navigate(['/mis-reservas']);
  }

  /**
   * Volver atrás
   */
  volver(): void {
    this.router.navigate(['/']);
  }

  /**
   * Obtener descripción corta
   */
  obtenerDescripcionCorta(descripcion?: string): string {
    if (!descripcion) return '';

    const textoLimpio = descripcion.replace(/<[^>]*>/g, '');

    if (textoLimpio.length <= 80) {
      return textoLimpio;
    }

    return textoLimpio.substring(0, 80) + '...';
  }

  /**
   * Manejar error de imagen
   */
  onImageError(event: Event): void {
    const el = event.target as HTMLImageElement;
    el.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="250" height="150"><rect width="100%" height="100%" fill="%230a1524"/><text x="50%" y="50%" fill="%235aa8ff" font-size="14" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Sin imagen</text></svg>';
  }
}

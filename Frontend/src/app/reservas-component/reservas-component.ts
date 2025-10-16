import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Modelos
import { Reserva } from '../Models/Reserva';
import { Habitacion } from '../Models/Habitacion';
import { Servicio } from '../Models/Servicio';
import { Usuario } from '../Models/Usuario';

// Componentes
import { HeaderComponent } from '../generales-components/header-component/header-component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reservas-component.html',
  styleUrls: ['./reservas-component.css'],
})
export class ReservasComponent implements OnInit {
  /** ------------------ VARIABLES PRINCIPALES ------------------ **/

  // Datos del formulario
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaMinima: string = '';

  // Datos cargados desde el backend
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  servicios: Servicio[] = [];

  // 🔹 INICIO CORRECCIÓN: lista de reservas existentes
  reservasExistentes: Reserva[] = [];
  // 🔹 FIN CORRECCIÓN

  // Filtro de tipo de habitación
  tiposHabitacion: string[] = [];
  tipoHabitacionSeleccionado: string = '';

  // Selecciones del usuario
  habitacionSeleccionada: Habitacion | null = null;
  serviciosSeleccionados: Servicio[] = [];

  // Estados de la interfaz
  loading = true;
  errorMsg = '';
  procesando = false;
  mostrarExito = false;
  reservaCreada: Reserva | null = null;

  /** ------------------ CONVERSOR DE MONEDAS ------------------ **/
  monedas = [
    { codigo: 'USD', nombre: 'Dólar estadounidense' },
    { codigo: 'EUR', nombre: 'Euro' },
    { codigo: 'GBP', nombre: 'Libra esterlina' },
    { codigo: 'JPY', nombre: 'Yen japonés' },
    { codigo: 'MXN', nombre: 'Peso mexicano' },
    { codigo: 'COP', nombre: 'Peso colombiano' },
  ];

  monedaSeleccionada = 'USD';
  tasaCambio = 0;
  totalConvertido: number | null = null;

  /** ------------------ URLs DEL BACKEND ------------------ **/
  private baseUrlReservas = 'http://localhost:8080/reservas';
  private baseUrlHabitaciones = 'http://localhost:8080/habitaciones';
  private baseUrlServicios = 'http://localhost:8080/servicios';

  /** ------------------ USUARIO SIMULADO ------------------ **/
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
    const today = new Date();
    this.fechaMinima = today.toISOString().split('T')[0];
    this.fechaInicio = this.fechaMinima;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.fechaFin = tomorrow.toISOString().split('T')[0];
  }

  /** ------------------ CICLO DE VIDA ------------------ **/
  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuario = JSON.parse(userData);
      if (usuario && usuario.idUsuario) {
        this.usuarioActual = usuario;
        this.cargarDatos();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /** ------------------ FUNCIÓN PRINCIPAL DE CARGA ------------------ **/
  cargarDatos(): void {
    this.loading = true;
    this.errorMsg = '';

    // 🔹 INICIO CORRECCIÓN: ahora también cargamos las reservas existentes
    forkJoin({
      habitaciones: this.http.get<Habitacion[]>(this.baseUrlHabitaciones),
      servicios: this.http.get<Servicio[]>(this.baseUrlServicios),
      reservas: this.http.get<Reserva[]>(this.baseUrlReservas),
    }).subscribe({
      next: (data) => {
        this.habitaciones = data.habitaciones.filter((h) => h.estado === 'Disponible');
        this.servicios = data.servicios;
        this.reservasExistentes = data.reservas;

        // Filtramos habitaciones según fechas iniciales
        this.filtrarHabitacionesDisponibles();

        // Extraer tipos únicos
        const tipos = this.habitaciones
          .map((h) => h.tipoHabitacion?.nombre)
          .filter((nombre): nombre is string => !!nombre);

        this.tiposHabitacion = Array.from(new Set(tipos));
        this.tipoHabitacionSeleccionado = '';

        this.loading = false;

        if (this.habitaciones.length === 0 && this.servicios.length === 0) {
          this.errorMsg = 'No hay datos disponibles en este momento';
        }
      },
      error: () => {
        this.errorMsg = 'No se pudo conectar con el servidor.';
        this.loading = false;
      },
    });
    // 🔹 FIN CORRECCIÓN
  }

  /** ------------------ VALIDACIÓN DE FECHAS ------------------ **/
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

    // 🔹 INICIO CORRECCIÓN: volver a filtrar cuando cambian las fechas
    this.filtrarHabitacionesDisponibles();
    // 🔹 FIN CORRECCIÓN
  }

  get diasEstancia(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    return Math.max(0, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
  }

  /** ------------------ FILTRO DE DISPONIBILIDAD ------------------ **/
  // 🔹 INICIO CORRECCIÓN: función nueva para filtrar habitaciones según reservas existentes
  filtrarHabitacionesDisponibles(): void {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    const estaReservada = (habitacionId: number): boolean => {
      return this.reservasExistentes.some((reserva) => {
        if (!reserva.habitacion || reserva.habitacion.idHabitacion !== habitacionId) return false;

        const inicioRes = new Date(reserva.fechaInicio);
        const finRes = new Date(reserva.fechaFin);

        // Si las fechas se traslapan, está reservada
        return inicio <= finRes && fin >= inicioRes;
      });
    };

    // Filtramos solo las que no estén reservadas
    this.habitacionesFiltradas = this.habitaciones.filter(
      (h) => h.idHabitacion !== undefined && !estaReservada(h.idHabitacion)
    );

    // Si hay filtro por tipo, se aplica después
    if (this.tipoHabitacionSeleccionado) {
      this.habitacionesFiltradas = this.habitacionesFiltradas.filter(
        (h) => h.tipoHabitacion?.nombre === this.tipoHabitacionSeleccionado
      );
    }

    this.habitacionSeleccionada = null;
  }
  // 🔹 FIN CORRECCIÓN

  /** ------------------ FILTRO DE TIPO DE HABITACIÓN ------------------ **/
  filtrarHabitacionesPorTipo(): void {
    // 🔹 INICIO CORRECCIÓN: reutilizamos la función general de disponibilidad
    this.filtrarHabitacionesDisponibles();
    // 🔹 FIN CORRECCIÓN
  }

  /** ------------------ MANEJO DE FORMULARIO ------------------ **/
  seleccionarHabitacion(habitacion: Habitacion) {
    this.habitacionSeleccionada =
      this.habitacionSeleccionada?.idHabitacion === habitacion.idHabitacion ? null : habitacion;
  }

  toggleServicio(servicio: Servicio) {
    const index = this.serviciosSeleccionados.findIndex(
      (s) => s.idServicio === servicio.idServicio
    );
    index > -1
      ? this.serviciosSeleccionados.splice(index, 1)
      : this.serviciosSeleccionados.push(servicio);
  }

  isServicioSeleccionado(idServicio: number): boolean {
    return this.serviciosSeleccionados.some((s) => s.idServicio === idServicio);
  }

  /** ------------------ CÁLCULOS DE COSTOS ------------------ **/
  calcularSubtotalHabitacion(): number {
    if (!this.habitacionSeleccionada || this.diasEstancia <= 0) return 0;
    return this.habitacionSeleccionada.precioPorNoche * this.diasEstancia;
  }

  calcularSubtotalServicios(): number {
    return this.serviciosSeleccionados.reduce((t, s) => t + s.precio, 0);
  }

  calcularTotal(): number {
    return this.calcularSubtotalHabitacion() + this.calcularSubtotalServicios();
  }

  /** ------------------ VALIDACIONES DE ESTADO ------------------ **/
  puedeReservar(): boolean {
    return (
      !!this.fechaInicio &&
      !!this.fechaFin &&
      this.diasEstancia > 0 &&
      !!this.habitacionSeleccionada
    );
  }

  /** ------------------ RESERVA ------------------ **/
  realizarReserva(): void {
    if (!this.puedeReservar() || this.procesando) return;
    this.procesando = true;

    const reserva: Partial<Reserva> = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      estado: 'CONFIRMADA',
      usuario: this.usuarioActual!,
      habitacion: this.habitacionSeleccionada!,
      servicios: this.serviciosSeleccionados,
    };

    this.http
      .post<Reserva>(this.baseUrlReservas, reserva)
      .pipe(
        catchError(() => {
          this.errorMsg = 'Error al procesar la reserva.';
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

  /** ------------------ UTILIDADES ------------------ **/
  limpiarFormulario(): void {
    const today = new Date();
    this.fechaInicio = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.fechaFin = tomorrow.toISOString().split('T')[0];

    this.tipoHabitacionSeleccionado = '';
    this.habitacionesFiltradas = [...this.habitaciones];
    this.habitacionSeleccionada = null;
    this.serviciosSeleccionados = [];
    this.totalConvertido = null;
  }

  cerrarModal(): void {
    this.mostrarExito = false;
    this.limpiarFormulario();
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  /** ------------------ CONVERSOR ------------------ **/
  convertirMoneda() {
    const totalCOP = this.calcularTotal();
    const tasas: any = {
      USD: 0.00026,
      EUR: 0.00023,
      GBP: 0.0002,
      JPY: 0.038,
      MXN: 0.0045,
      COP: 1,
    };
    this.tasaCambio = tasas[this.monedaSeleccionada] || 1;
    this.totalConvertido = totalCOP * this.tasaCambio;
  }

  /** ------------------ AUXILIARES ------------------ **/
  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/img/placeholder.jpg';
  }

  obtenerDescripcionCorta(descripcion: string): string {
    if (!descripcion) return '';
    const maxLength = 100;
    return descripcion.length > maxLength
      ? descripcion.substring(0, maxLength) + '...'
      : descripcion;
  }
}

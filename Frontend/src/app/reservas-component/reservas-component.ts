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
  cantidadPersonas: number = 2;
  fechaMinima: string = '';

  // Datos cargados desde el backend
  habitaciones: Habitacion[] = [];
  servicios: Servicio[] = [];

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
    // Cargar Usuario
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuario = JSON.parse(userData);
      if (usuario && usuario.idUsuario) {
        this.usuarioActual = usuario;
        this.cargarDatos();
      }
    } else {
      //Llevamos al login
      this.router.navigate(['/login']);
    }
  }

  /** ------------------ FUNCIONES DE CARGA ------------------ **/
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
      error: () => {
        this.errorMsg = 'No se pudo conectar con el servidor.';
        this.loading = false;
      },
    });
  }

  /** ------------------ FUNCIONES DE VALIDACIÓN ------------------ **/
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

  get diasEstancia(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    return Math.max(0, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
  }

  /** ------------------ MANEJO DE FORMULARIO ------------------ **/
  incrementarPersonas() {
    if (this.cantidadPersonas < 10) this.cantidadPersonas++;
  }

  decrementarPersonas() {
    if (this.cantidadPersonas > 1) this.cantidadPersonas--;
  }

  seleccionarHabitacion(habitacion: Habitacion) {
    if (habitacion.capacidad < this.cantidadPersonas) return;
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
      !!this.habitacionSeleccionada &&
      this.cantidadPersonas > 0
    );
  }

  /** ------------------ RESERVA ------------------ **/
  realizarReserva(): void {
    if (!this.puedeReservar() || this.procesando) return;
    this.procesando = true;

    const reserva: Partial<Reserva> = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      cantidadPersonas: this.cantidadPersonas,
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
    this.cantidadPersonas = 2;
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
    element.src = 'assets/img/placeholder.jpg'; // Imagen por defecto
  }

  obtenerDescripcionCorta(descripcion: string): string {
    if (!descripcion) return '';
    const maxLength = 100;
    return descripcion.length > maxLength
      ? descripcion.substring(0, maxLength) + '...'
      : descripcion;
  }
}

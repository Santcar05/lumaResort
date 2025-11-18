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
import { RuletaComponent } from '../ruleta-component/ruleta-component';

// Servicios
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RuletaComponent],
  templateUrl: './reservas-component.html',
  styleUrls: ['./reservas-component.css'],
})
export class ReservasComponent implements OnInit {
  // Datos del formulario
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaMinima: string = '';

  // Datos cargados desde el backend
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  servicios: Servicio[] = [];

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
  mostrarRuleta = false;
  reservaCreada: Reserva | null = null;
  premioGanado = '';

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
  private baseUrlHabitacionesDisponibles = 'http://localhost:8080/habitaciones/disponibles';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    const today = new Date();
    this.fechaMinima = today.toISOString().split('T')[0];
    this.fechaInicio = this.fechaMinima;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.fechaFin = tomorrow.toISOString().split('T')[0];
  }

  /** ------------------ CICLO DE VIDA ------------------ **/
  ngOnInit(): void {
    // Usar AuthService para obtener el usuario autenticado
    const usuario = this.authService.getUser();
    if (usuario && usuario.idUsuario) {
      // Adaptar UserResponse a Usuario para compatibilidad
      this.usuarioActual = {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        cedula: usuario.cedula,
        rol: 'CLIENTE',
        contrasena: '',
        esOperador: false,
        esAdministrador: false,
      };
      this.cargarDatos();
    } else {
      // Si no hay usuario autenticado, redirigir a login
      this.router.navigate(['/login']);
    }
  }

  /** ------------------ FUNCIÓN PRINCIPAL DE CARGA ------------------ **/
  cargarDatos(): void {
    this.loading = true;
    this.errorMsg = '';

    // Cargar solo servicios inicialmente
    forkJoin({
      servicios: this.http.get<Servicio[]>(this.baseUrlServicios),
    }).subscribe({
      next: (data) => {
        this.servicios = data.servicios;

        // Cargar habitaciones disponibles usando el nuevo endpoint
        this.filtrarHabitacionesDisponibles();

        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo conectar con el servidor.';
        this.loading = false;
      },
    });
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

    this.filtrarHabitacionesDisponibles();
  }

  get diasEstancia(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    return Math.max(0, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
  }

  /** ------------------ FILTRO DE DISPONIBILIDAD ------------------ **/
  filtrarHabitacionesDisponibles(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      return;
    }

    // Llamar al nuevo endpoint del backend
    const url = `${this.baseUrlHabitacionesDisponibles}?fechaInicio=${this.fechaInicio}&fechaFin=${this.fechaFin}`;

    this.http.get<Habitacion[]>(url).subscribe({
      next: (habitacionesDisponibles) => {
        this.habitaciones = habitacionesDisponibles;
        this.habitacionesFiltradas = habitacionesDisponibles;

        // Si hay filtro por tipo, se aplica
        if (this.tipoHabitacionSeleccionado) {
          this.habitacionesFiltradas = this.habitacionesFiltradas.filter(
            (h) => h.tipoHabitacion?.nombre === this.tipoHabitacionSeleccionado
          );
        }

        // Extraer tipos únicos de las habitaciones disponibles
        const tipos = this.habitaciones
          .map((h) => h.tipoHabitacion?.nombre)
          .filter((nombre): nombre is string => !!nombre);

        this.tiposHabitacion = Array.from(new Set(tipos));

        this.habitacionSeleccionada = null;

        if (this.habitaciones.length === 0) {
          this.errorMsg = 'No hay habitaciones disponibles para las fechas seleccionadas';
        } else {
          this.errorMsg = '';
        }
      },
      error: (err) => {
        console.error('Error al cargar habitaciones disponibles:', err);
        this.errorMsg = 'Error al cargar habitaciones disponibles';
        this.habitacionesFiltradas = [];
      },
    });
  }

  /** ------------------ FILTRO DE TIPO DE HABITACIÓN ------------------ **/
  filtrarHabitacionesPorTipo(): void {
    this.filtrarHabitacionesDisponibles();
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
  // En el método realizarReserva(), después de recibir la respuesta:
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
      cantidadPersonas: this.habitacionSeleccionada?.capacidad,
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

          setTimeout(() => {
            this.mostrarExito = false;
            this.mostrarRuleta = true;
          }, 2000);
        }
      });
  }

  /** ------------------ MANEJO DE RULETA ------------------ **/
  onPremioSeleccionado(premio: any): void {
    // Si es un string, úsalo directamente
    if (typeof premio === 'string') {
      this.premioGanado = premio;
    }
    // Si es un objeto OfertaFlash, extrae la propiedad nombre
    else if (premio && premio.nombre) {
      this.premioGanado = premio.nombre;
    }
    // Si tiene otra estructura, manéjalo según corresponda
    else if (premio && premio.descripcion) {
      this.premioGanado = premio.descripcion;
    }

    console.log('🎉 Premio ganado:', this.premioGanado);
  }

  onCerrarRuleta(): void {
    this.mostrarRuleta = false;

    // Redirigir a "Ver Reservas" después de cerrar la ruleta
    setTimeout(() => {
      this.router.navigate(['/ver-reservas']); // Ajusta la ruta según tu configuración
    }, 300);
  }

  /** ------------------ GUARDAR PREMIO (OPCIONAL) ------------------ **/
  guardarPremioEnReserva(idReserva: number | undefined, premio: string): void {
    if (!idReserva) return;

    const url = `${this.baseUrlReservas}/${idReserva}/premio`;

    this.http.patch(url, { premio }).subscribe({
      next: () => console.log('✅ Premio guardado en la reserva'),
      error: (err) => console.error('❌ Error al guardar premio:', err),
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
    // Mostrar ruleta inmediatamente al cerrar el modal manualmente
    this.mostrarRuleta = true;
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

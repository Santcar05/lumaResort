import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../Models/Reserva';
import { Pago } from '../Models/Pago';
import { ReservaService } from '../service/reserva/reserva-service';
import { PagoService } from '../service/pago/pago-service';

@Component({
  selector: 'app-estadia-operador-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadia-operador-component.html',
  styleUrls: ['./estadia-operador-component.css'],
})
export class EstadiaOperadorComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  reservasPaginadas: Reserva[] = [];
  pagos: Pago[] = [];

  // Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 4;

  // Filtros
  filtroId: string = '';
  filtroHabitacion: string = '';
  filtroEstado: string = 'TODAS';
  estados: string[] = ['TODAS', 'PENDIENTE', 'CONFIRMADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA'];

  // Modales
  modalPagarAbierto: boolean = false;
  modalActivarAbierto: boolean = false;
  modalFinalizarAbierto: boolean = false;

  reservaSeleccionada: Reserva | null = null;

  // Datos para pagos
  datosPago: any = {
    monto: 0,
    metodoPago: 'EFECTIVO',
    referencia: '',
  };

  metodosPago: string[] = ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA'];

  // Notificación
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' | 'info' = 'exito';

  constructor(private reservaService: ReservaService, private pagoService: PagoService) {}

  ngOnInit(): void {
    this.cargarReservas();
    this.cargarPagos();
  }

  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
        this.actualizarPaginacion();
        this.mostrarMensaje(`${data.length} reservas cargadas correctamente`, 'info');
      },
      error: () => this.mostrarMensaje('Error al cargar las reservas', 'error'),
    });
  }

  cargarPagos(): void {
    this.pagoService.findAll().subscribe({
      next: (data) => {
        this.pagos = data;
      },
      error: () => console.error('Error al cargar los pagos'),
    });
  }

  filtrarReservas(): void {
    const idFiltro = this.filtroId.trim().toLowerCase();
    const habitacionFiltro = this.filtroHabitacion.trim().toLowerCase();
    const estadoFiltro = this.filtroEstado;

    this.reservasFiltradas = this.reservas.filter((reserva) => {
      const coincideId = idFiltro ? reserva.idReserva.toString().includes(idFiltro) : true;
      const coincideHabitacion = habitacionFiltro
        ? reserva.habitacion?.numero?.toString().includes(habitacionFiltro)
        : true;
      const coincideEstado = estadoFiltro === 'TODAS' ? true : reserva.estado === estadoFiltro;

      return coincideId && coincideHabitacion && coincideEstado;
    });
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  limpiarFiltros(): void {
    this.filtroId = '';
    this.filtroHabitacion = '';
    this.filtroEstado = 'TODAS';
    this.reservasFiltradas = this.reservas;
  }
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.reservasPaginadas = this.reservasFiltradas.slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.reservasFiltradas.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  // Calcular total de la cuenta de una reserva
  calcularTotalReserva(reserva: Reserva): number {
    let total = 0;

    // Sumar servicios
    if (reserva.servicios) {
      total += reserva.servicios.reduce((sum, servicio) => sum + (servicio.precio || 0), 0);
    }

    // sumar el precio de la habitación
    if (reserva.habitacion) {
      total += reserva.habitacion.precioPorNoche || 0;
    }

    // Aquí podrías agregar el costo de la habitación, etc.
    return total;
  }

  // Obtener pagos de una reserva
  getPagosReserva(reservaId: number): Pago[] {
    return this.pagos.filter((pago) => pago.reserva?.idReserva === reservaId);
  }

  // Calcular saldo pendiente
  getSaldoPendiente(reserva: Reserva): number {
    const total = this.calcularTotalReserva(reserva);
    const pagosReserva = this.getPagosReserva(reserva.idReserva);
    const totalPagado = pagosReserva.reduce((sum, pago) => sum + (pago.monto || 0), 0);

    return Math.max(0, total - totalPagado);
  }

  // Verificar si la cuenta está limpia (totalmente pagada)
  isCuentaLimpia(reserva: Reserva): boolean {
    return this.getSaldoPendiente(reserva) === 0;
  }

  // Abrir modales
  abrirModalPagar(reserva: Reserva): void {
    this.reservaSeleccionada = reserva;
    const saldoPendiente = this.getSaldoPendiente(reserva);

    this.datosPago = {
      monto: saldoPendiente,
      metodoPago: 'EFECTIVO',
      referencia: '',
    };

    this.modalPagarAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  abrirModalActivar(reserva: Reserva): void {
    this.reservaSeleccionada = reserva;
    this.modalActivarAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  abrirModalFinalizar(reserva: Reserva): void {
    this.reservaSeleccionada = reserva;

    // Verificar si la cuenta está limpia antes de permitir finalizar
    if (!this.isCuentaLimpia(reserva)) {
      this.mostrarMensaje(
        'No se puede finalizar la estadía: la cuenta no está completamente pagada',
        'error'
      );
      return;
    }

    this.modalFinalizarAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  // Cerrar modales
  cerrarModalPagar(): void {
    this.modalPagarAbierto = false;
    this.reservaSeleccionada = null;
    document.body.style.overflow = 'auto';
  }

  cerrarModalActivar(): void {
    this.modalActivarAbierto = false;
    this.reservaSeleccionada = null;
    document.body.style.overflow = 'auto';
  }

  cerrarModalFinalizar(): void {
    this.modalFinalizarAbierto = false;
    this.reservaSeleccionada = null;
    document.body.style.overflow = 'auto';
  }

  // Acciones principales
  pagarCuenta(): void {
    if (!this.reservaSeleccionada) return;

    const pago: Pago = {
      idPago: 0,
      monto: this.datosPago.monto,
      fecha: new Date(),
      estado: 'COMPLETADO',
      reserva: this.reservaSeleccionada,
      metodoPago: {
        idMetodo: 0,
        nombre: this.datosPago.metodoPago,
      },
    };

    this.pagoService.create(pago).subscribe({
      next: () => {
        this.mostrarMensaje(`Pago de $${this.datosPago.monto} procesado exitosamente`, 'exito');
        this.cerrarModalPagar();
        this.cargarPagos();
      },
      error: () => this.mostrarMensaje('Error al procesar el pago', 'error'),
    });
  }

  activarEstadia(): void {
    if (!this.reservaSeleccionada) return;

    const reservaActualizada = {
      ...this.reservaSeleccionada,
      estado: 'ACTIVA',
    };

    this.reservaService.update(reservaActualizada).subscribe({
      next: () => {
        this.mostrarMensaje('Estadía activada correctamente', 'exito');
        this.cerrarModalActivar();
        this.cargarReservas();
      },
      error: () => this.mostrarMensaje('Error al activar la estadía', 'error'),
    });
  }

  finalizarEstadia(): void {
    if (!this.reservaSeleccionada) return;

    const reservaActualizada = {
      ...this.reservaSeleccionada,
      estado: 'FINALIZADA',
    };

    this.reservaService.update(reservaActualizada).subscribe({
      next: () => {
        this.mostrarMensaje('Estadía finalizada correctamente', 'exito');
        this.cerrarModalFinalizar();
        this.cargarReservas();
      },
      error: () => this.mostrarMensaje('Error al finalizar la estadía', 'error'),
    });
  }

  limpiarCuenta(reserva: Reserva): void {
    if (!this.isCuentaLimpia(reserva)) {
      this.mostrarMensaje('No se puede limpiar la cuenta: aún hay saldo pendiente', 'error');
      return;
    }

    // Aquí podrías implementar lógica adicional para "limpiar" la cuenta
    this.mostrarMensaje('Cuenta limpiada correctamente', 'exito');
  }

  // Utilidades
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'info' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 4000);
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

  formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString('es-ES')}`;
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  puedeActivar(reserva: Reserva): boolean {
    return reserva.estado === 'CONFIRMADA';
  }

  puedeFinalizar(reserva: Reserva): boolean {
    return reserva.estado === 'ACTIVA' && this.isCuentaLimpia(reserva);
  }

  puedePagar(reserva: Reserva): boolean {
    return (
      this.getSaldoPendiente(reserva) > 0 &&
      (reserva.estado === 'ACTIVA' || reserva.estado === 'CONFIRMADA')
    );
  }
}

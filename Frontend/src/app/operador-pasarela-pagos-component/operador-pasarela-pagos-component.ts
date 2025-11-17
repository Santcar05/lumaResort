import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../service/payment/payment-service';
import { StripeService } from '../service/stripe/stripe-service';
import { ReservaService } from '../service/reserva/reserva-service';
import { PagoService } from '../service/pago/pago-service';
import { Reserva } from '../Models/Reserva';
import { Pago } from '../Models/Pago';
import { Payment, CardDetails, BillingAddress } from '../Models/Payment';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-operador-pasarela-pagos-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operador-pasarela-pagos-component.html',
  styleUrls: ['./operador-pasarela-pagos-component.css'],
})
export class OperadorPasarelaPagosComponent implements OnInit, OnDestroy {
  // Método de pago seleccionado
  metodoPago: 'EFECTIVO' | 'TARJETA' = 'EFECTIVO';

  // Datos del pago
  reservaSeleccionadaId: number | null = null;
  reservaSeleccionada: Reserva | null = null;
  monto: number = 0;
  descripcion: string = '';

  // Lista de reservas disponibles
  reservasDisponibles: Reserva[] = [];

  // Datos de tarjeta
  cardholderName: string = '';
  email: string = '';
  billingAddress: BillingAddress = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'CO',
  };

  // Estado del formulario
  procesandoPago: boolean = false;
  stripeInicializado: boolean = false;
  formularioValido: boolean = false;

  // Notificación
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' | 'info' = 'exito';

  // Payment Intent
  clientSecret: string = '';
  paymentIntentId: string = '';

  // Validación de tarjeta
  tarjetaValida: boolean = false;
  errorTarjeta: string = '';

  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService,
    private reservaService: ReservaService,
    private pagoService: PagoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.cargarReservas();
    await this.inicializarStripe();
  }

  ngOnDestroy(): void {
    // Limpiar completamente Stripe cuando el componente se destruye
    this.stripeService.cleanup();
    this.stripeInicializado = false;
  }

  async inicializarStripe(): Promise<void> {
    try {
      await this.stripeService.initializeStripe();
      this.stripeService.createElements();
      this.stripeInicializado = true;
      console.log('✅ Stripe inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Stripe:', error);
      this.stripeInicializado = false;
      this.mostrarMensaje('Error al inicializar el sistema de pagos', 'error');
    }
  }

  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        // Filtrar solo reservas activas o confirmadas
        this.reservasDisponibles = data.filter(
          (r) => r.estado === 'ACTIVA' || r.estado === 'CONFIRMADA'
        );
        console.log(`📋 ${this.reservasDisponibles.length} reservas disponibles`);

        const idReserva = this.route.snapshot.paramMap.get('idReserva');
        if (idReserva) {
          this.reservaSeleccionadaId = Number(idReserva);
          this.onReservaChange();
        }
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.mostrarMensaje('Error al cargar las reservas', 'error');
      },
    });
  }

  onMetodoPagoChange(): void {
    if (this.metodoPago === 'TARJETA' && this.stripeInicializado) {
      setTimeout(() => {
        this.montarElementoTarjeta();
      }, 100);
    } else {
      this.stripeService.destroyCardElement();
      this.tarjetaValida = false;
      this.errorTarjeta = '';
    }
    this.validarFormulario();
  }

  montarElementoTarjeta(): void {
    const cardElement = document.getElementById('card-element');
    if (!cardElement) {
      console.error('❌ Elemento card-element no encontrado en el DOM');
      return;
    }

    // Verificar si Stripe está inicializado
    if (!this.stripeInicializado) {
      console.error('❌ Stripe no está inicializado');
      this.mostrarMensaje('Error: Sistema de pagos no disponible', 'error');
      return;
    }

    // Limpiar el contenedor y recrear el elemento
    this.stripeService.createCardElement('card-element');

    // Escuchar cambios en el elemento de tarjeta
    const card = this.stripeService.getCardElement();
    if (card) {
      card.on('change', (event) => {
        if (event.error) {
          this.errorTarjeta = event.error.message;
          this.tarjetaValida = false;
        } else {
          this.errorTarjeta = '';
          this.tarjetaValida = event.complete;
        }
        this.validarFormulario();
      });
    }
  }

  onReservaChange(): void {
    if (this.reservaSeleccionadaId) {
      this.reservaSeleccionada =
        this.reservasDisponibles.find((r) => r.idReserva === this.reservaSeleccionadaId) || null;
      if (this.reservaSeleccionada) {
        // Calcular monto sugerido (puede ser el total de servicios, habitación, etc.)
        this.calcularMontoSugerido();
      }
    } else {
      this.reservaSeleccionada = null;
      this.monto = 0;
    }
    this.validarFormulario();
  }

  calcularMontoSugerido(): void {
    if (!this.reservaSeleccionada) return;

    let total = 0;

    // Sumar precio de habitación
    if (this.reservaSeleccionada.habitacion?.precioPorNoche) {
      const dias = this.calcularDiasEstancia();
      total += this.reservaSeleccionada.habitacion.precioPorNoche * dias;
    }

    // Sumar servicios contratados
    if (this.reservaSeleccionada.servicios) {
      total += this.reservaSeleccionada.servicios.reduce(
        (acc, servicio) => acc + (servicio.precio || 0),
        0
      );
    }

    this.monto = total;
  }

  calcularDiasEstancia(): number {
    if (!this.reservaSeleccionada) return 0;
    const inicio = new Date(this.reservaSeleccionada.fechaInicio);
    const fin = new Date(this.reservaSeleccionada.fechaFin);
    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  validarFormulario(): void {
    const baseValido =
      this.reservaSeleccionadaId !== null && this.monto > 0 && !this.procesandoPago;

    if (this.metodoPago === 'EFECTIVO') {
      this.formularioValido = baseValido;
    } else if (this.metodoPago === 'TARJETA') {
      this.formularioValido =
        baseValido &&
        this.stripeInicializado &&
        this.tarjetaValida &&
        this.cardholderName.trim() !== '' &&
        this.email.trim() !== '' &&
        this.validarEmail(this.email) &&
        this.billingAddress.street.trim() !== '' &&
        this.billingAddress.city.trim() !== '' &&
        this.billingAddress.zipCode.trim() !== '';
    }
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async procesarPago(): Promise<void> {
    if (!this.formularioValido || this.procesandoPago) return;

    this.procesandoPago = true;
    this.mostrarMensaje('Procesando pago...', 'info');

    try {
      if (this.metodoPago === 'EFECTIVO') {
        await this.procesarPagoEfectivo();
      } else if (this.metodoPago === 'TARJETA') {
        await this.procesarPagoTarjeta();
      }
    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      this.mostrarMensaje('Error al procesar el pago. Intente nuevamente.', 'error');
      this.procesandoPago = false;
    }
  }

  async procesarPagoEfectivo(): Promise<void> {
    if (!this.reservaSeleccionadaId) return;

    // Primero procesar el pago en el sistema de pagos (si es necesario)
    this.paymentService.processCashPayment(this.reservaSeleccionadaId, this.monto).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Pago en efectivo procesado en PaymentService');

          // Ahora crear el registro de Pago en la base de datos
          this.crearRegistroPago('EFECTIVO');
        } else {
          this.mostrarMensaje(response.message || 'Error al procesar el pago', 'error');
          this.procesandoPago = false;
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.mostrarMensaje('Error al registrar el pago en efectivo', 'error');
        this.procesandoPago = false;
      },
    });
  }

  async procesarPagoTarjeta(): Promise<void> {
    if (!this.reservaSeleccionadaId) return;

    // Verificar que Stripe esté completamente inicializado
    if (!this.stripeInicializado || !this.stripeService.hasCardElement()) {
      this.mostrarMensaje('Error: El sistema de pagos no está listo', 'error');
      this.procesandoPago = false;
      return;
    }

    try {
      console.log('💳 Iniciando proceso de pago con tarjeta...');

      // Paso 1: Crear Payment Intent
      this.paymentService.createPaymentIntent(this.monto, this.reservaSeleccionadaId).subscribe({
        next: async (paymentIntent) => {
          try {
            this.clientSecret = paymentIntent.clientSecret;
            this.paymentIntentId = paymentIntent.paymentIntentId;

            console.log('🔐 Payment Intent creado:', this.paymentIntentId);

            // Paso 2: Confirmar pago con Stripe
            const result = await this.stripeService.confirmCardPayment(
              this.clientSecret,
              this.cardholderName,
              this.email,
              this.billingAddress
            );

            if (result.error) {
              console.error('❌ Error en Stripe:', result.error);
              this.mostrarMensaje(`Error en el pago: ${result.error.message}`, 'error');
              this.procesandoPago = false;
            } else if (result.paymentIntent?.status === 'succeeded') {
              console.log('✅ Pago confirmado en Stripe');
              // Paso 3: Confirmar en backend
              this.confirmarPagoEnBackend();
            }
          } catch (stripeError: any) {
            console.error('❌ Error en confirmCardPayment:', stripeError);
            this.mostrarMensaje(
              stripeError?.message || 'Error al procesar el pago con Stripe',
              'error'
            );
            this.procesandoPago = false;
          }
        },
        error: (error) => {
          console.error('❌ Error al crear payment intent:', error);
          this.mostrarMensaje('Error al iniciar el proceso de pago', 'error');
          this.procesandoPago = false;
        },
      });
    } catch (error) {
      console.error('❌ Error:', error);
      this.mostrarMensaje('Error al procesar el pago con tarjeta', 'error');
      this.procesandoPago = false;
    }
  }

  confirmarPagoEnBackend(): void {
    if (!this.reservaSeleccionadaId) return;

    console.log('🔄 Confirmando pago en backend...');

    this.paymentService
      .processCardPayment(this.paymentIntentId, this.reservaSeleccionadaId, this.monto)
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('✅ Pago confirmado en backend');

            // Ahora crear el registro de Pago en la base de datos
            this.crearRegistroPago('TARJETA_CREDITO');
          } else {
            this.mostrarMensaje(response.message || 'Error al confirmar el pago', 'error');
            this.procesandoPago = false;
          }
        },
        error: (error) => {
          console.error('❌ Error al confirmar en backend:', error);
          this.mostrarMensaje('Error al confirmar el pago en el sistema', 'error');
          this.procesandoPago = false;
        },
      });
  }

  /**
   * Crea un registro de Pago en la base de datos asociado a la reserva
   */
  crearRegistroPago(metodoPago: string): void {
    if (!this.reservaSeleccionadaId) return;

    console.log('💾 Creando registro de pago en la base de datos...');

    const pago: Pago = {
      monto: this.monto,
      fecha: new Date(),
      estado: 'COMPLETADO',
      metodoPago: metodoPago,
      reserva: { idReserva: this.reservaSeleccionadaId } as Reserva,
    };

    this.pagoService.create(pago).subscribe({
      next: (pagoCreado) => {
        console.log('✅ Registro de pago creado:', pagoCreado);

        const tipoMetodo = metodoPago === 'EFECTIVO' ? 'efectivo' : 'tarjeta';
        this.mostrarMensaje(
          `Pago de ${this.formatearPrecio(this.monto)} procesado exitosamente (${tipoMetodo})`,
          'exito'
        );

        // Limpiar formulario antes de navegar
        this.limpiarDatosFormulario();

        // Esperar a que se muestre el mensaje antes de navegar
        setTimeout(() => {
          this.router.navigate(['/operador/pago']);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Error al crear registro de pago:', error);
        this.mostrarMensaje(
          'El pago fue procesado pero no se pudo registrar en el sistema',
          'error'
        );
        this.procesandoPago = false;
      },
    });
  }

  /**
   * Limpia todos los datos del formulario después de un pago exitoso
   */
  limpiarDatosFormulario(): void {
    console.log('🧹 Limpiando datos del formulario...');

    // Limpiar datos de pago
    this.reservaSeleccionadaId = null;
    this.reservaSeleccionada = null;
    this.monto = 0;
    this.descripcion = '';

    // Limpiar datos de tarjeta
    this.cardholderName = '';
    this.email = '';
    this.billingAddress = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'CO',
    };

    // Limpiar Payment Intent
    this.clientSecret = '';
    this.paymentIntentId = '';

    // Limpiar validaciones
    this.tarjetaValida = false;
    this.errorTarjeta = '';
    this.formularioValido = false;

    // Limpiar elemento de Stripe
    this.stripeService.destroyCardElement();
  }

  /**
   * Resetea el formulario completamente (usado cuando el usuario quiere hacer otro pago SIN navegar)
   */
  resetearFormulario(): void {
    console.log('🔄 Reseteando formulario...');

    this.limpiarDatosFormulario();
    this.procesandoPago = false;

    // Recrear elemento de tarjeta si es necesario
    if (this.metodoPago === 'TARJETA' && this.stripeInicializado) {
      setTimeout(() => this.montarElementoTarjeta(), 100);
    }

    this.cargarReservas();
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'info' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 4000);
  }

  formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString('es-ES')}`;
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  getDescripcionReserva(reserva: Reserva): string {
    const cliente = reserva.usuario
      ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
      : 'Sin cliente';
    const habitacion = reserva.habitacion ? `Hab. ${reserva.habitacion.numero}` : 'Sin habitación';
    return `Reserva #${reserva.idReserva} - ${cliente} - ${habitacion}`;
  }

  getIconoTarjeta(tipo: string): string {
    const iconos: { [key: string]: string } = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      default: '💳',
    };
    return iconos[tipo.toLowerCase()] || iconos['default'];
  }
}

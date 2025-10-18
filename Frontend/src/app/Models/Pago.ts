import { CuentaHabitacion } from './CuentaHabitacion';
import { MetodoPago } from './MetodoPago';
import { Reserva } from './Reserva';

export interface Pago {
  idPago: number;
  monto: number;
  fecha: string | Date;
  estado: string;
  reserva: Reserva;
  metodoPago: MetodoPago;
}

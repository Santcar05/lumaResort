import { CuentaHabitacion } from './CuentaHabitacion';
import { MetodoPago } from './MetodoPago';

export interface Pago {
  idPago: number;
  monto: number;
  fecha: string | Date;
  estado: string;
  cuentaHabitacion: CuentaHabitacion;
  metodoPago: MetodoPago;
}

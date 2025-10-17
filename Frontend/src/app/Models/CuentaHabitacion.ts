import { Habitacion } from './Habitacion';
import { Pago } from './Pago';
import { Servicio } from './Servicio';

export interface CuentaHabitacion {
  idCuentaHabitacion: number;
  total: number;
  habitaciones?: Habitacion[];
  servicios?: Servicio[];
  pagos?: Pago[];
}

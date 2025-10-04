import { CuentaHabitacion } from './CuentaHabitacion';
import { TipoHabitacion } from './TipoHabitacion';

export interface Habitacion {
  idHabitacion: number;
  numero: string;
  precioPorNoche: number;
  estado: string;
  capacidad: number;
  descripcion: string;
  imagenUrl: string;
  tipoHabitacion?: TipoHabitacion;
  // Cuenta Habitacion Eliminada
}

import { Habitacion } from './Habitacion';

export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  habitaciones?: Habitacion[];
}

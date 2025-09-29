import { Habitacion } from './Habitacion';

export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  imagenesURL?: string[];
  caracteristicas?: string;
  habitaciones?: Habitacion[];
}

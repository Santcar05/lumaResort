import { Habitacion } from './Habitacion';
import { Servicio } from './Servicio';
import { Usuario } from './Usuario';

export interface Reserva {
  idReserva: number;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  cantidadPersonas: number;
  estado: string;
  cliente: Usuario;
  habitacion: Habitacion;
  servicios: Servicio[];
}

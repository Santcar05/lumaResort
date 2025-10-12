import { Habitacion } from './Habitacion';
import { Servicio } from './Servicio';
import { Usuario } from './Usuario';

export interface Reserva {
  idReserva: number;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  cantidadPersonas: number;
  estado: string;
  usuario: Usuario;
  habitacion: Habitacion;
  servicios: Servicio[];
}

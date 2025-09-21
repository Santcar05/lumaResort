import { Cliente } from './Cliente';

export interface Reserva {
  idReserva: number;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  cantidadPersonas: number;
  estado: string;
  cliente: Cliente;
}

import { Reserva } from './Reserva';
import { Usuario } from './Usuario';

export interface Cliente {
  idCliente: number;
  usuario?: Usuario;
  reservas?: Reserva[];
}

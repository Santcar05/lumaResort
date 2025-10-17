import { Usuario } from './Usuario';
import { Reserva } from './Reserva';

export interface Premio {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  usuario?: Usuario;  // Opcional: usuario que ganó el premio
  reserva?: Reserva;  // Opcional: reserva asociada al premio
}
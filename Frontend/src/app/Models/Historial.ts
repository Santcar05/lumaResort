import { Usuario } from './Usuario';

export interface Historial {
  idHistorial: number;
  fecha: string | Date;
  resumen: string;
  usuario?: Usuario;
}

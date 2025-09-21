import { Usuario } from './Usuario';

export interface Configuracion {
  id: number;
  notificacionesActivas: boolean;
  idioma: string;
  temaVisual: TemaVisual;
  usuario: Usuario;
}

export type TemaVisual = 'CLARO' | 'OSCURO' | 'AUTOMATICO';

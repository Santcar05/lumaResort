import { Administrador } from './Administrador';
import { Cliente } from './Cliente';
import { Configuracion } from './Configuracion';
import { Historial } from './Historial';
import { Operador } from './Operador';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  cedula: string;
  telefono: string;
  esOperador: boolean;
  esAdministrador: boolean;
  rol: string;
  cliente?: Cliente;
  administrador?: Administrador;
  operador?: Operador;
  configuracion?: Configuracion;
  historial?: Historial[];
}

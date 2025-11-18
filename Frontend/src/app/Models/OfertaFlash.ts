export interface OfertaFlash {
  id: number;
  titulo: string;
  descripcion: string;
  tipoOferta: string; // 'UPGRADE' | 'DESCUENTO_HABITACION' | 'SERVICIO_GRATIS' | 'DESCUENTO_SERVICIOS'
  porcentajeDescuento: number;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  activa: boolean;
  color: string; // Color del banner
  icono: string; // Emoji o icono
}

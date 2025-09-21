export interface Servicio {
  idServicio: number;
  tipoServicio: string;
  descripcion: string;
  nombre: string;
  precio: number;
  imagenURL: string;
  comentarios?: Comentario[];
}

export interface Comentario {
  idComentario: number;
  comentario: string;
  fecha: Date;
  calificacion: number;
}

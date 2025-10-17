import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../Models/Servicio';
import { CRUDServiciosService } from '../service/servicios/CRUD/crudservicios-service';

@Component({
  selector: 'app-servicios-operador-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-operador-component.html',
  styleUrls: ['./servicios-operador-component.css'],
})
export class ServiciosOperadorComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];

  // Filtros
  filtroId: string = '';
  filtroNombre: string = '';
  filtroTipo: string = 'TODOS';
  tipos: string[] = [
    'TODOS',
    'RESTAURANTE',
    'SPA',
    'LAVANDERIA',
    'TRANSPORTE',
    'ENTRETENIMIENTO',
    'OTROS',
  ];

  // Servicio seleccionado
  servicioAEliminar: Servicio | null = null;
  modalContratarAbierto: boolean = false;
  servicioAContratar: Servicio | null = null;

  datosContratacion: any = {
    habitacionId: '',
    fecha: '',
    comentario: '',
    calificacion: 5,
  };

  // Notificación
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' | 'info' = 'exito';

  constructor(private serviciosService: CRUDServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.serviciosService.findAll().subscribe({
      next: (data) => {
        this.servicios = data;
        this.serviciosFiltrados = data;
        this.mostrarMensaje(`${data.length} servicios cargados correctamente`, 'info');
      },
      error: () => this.mostrarMensaje('Error al cargar los servicios', 'error'),
    });
  }

  filtrarServicios(): void {
    const idFiltro = this.filtroId.trim().toLowerCase();
    const nombreFiltro = this.filtroNombre.trim().toLowerCase();
    const tipoFiltro = this.filtroTipo;

    this.serviciosFiltrados = this.servicios.filter((servicio) => {
      const coincideId = idFiltro ? servicio.idServicio.toString().includes(idFiltro) : true;
      const coincideNombre = nombreFiltro
        ? servicio.nombre.toLowerCase().includes(nombreFiltro)
        : true;
      const coincideTipo = tipoFiltro === 'TODOS' ? true : servicio.tipo === tipoFiltro;
      return coincideId && coincideNombre && coincideTipo;
    });
  }

  limpiarFiltros(): void {
    this.filtroId = '';
    this.filtroNombre = '';
    this.filtroTipo = 'TODOS';
    this.serviciosFiltrados = this.servicios;
  }

  abrirModalContratar(servicio: Servicio): void {
    this.servicioAContratar = servicio;
    this.modalContratarAbierto = true;
    this.datosContratacion = {
      habitacionId: '',
      fecha: new Date().toISOString().split('T')[0],
      comentario: '',
      calificacion: 5,
    };
    document.body.style.overflow = 'hidden';
  }

  cerrarModalContratar(): void {
    this.modalContratarAbierto = false;
    this.servicioAContratar = null;
    document.body.style.overflow = 'auto';
  }

  contratarServicio(): void {
    if (!this.servicioAContratar || !this.datosContratacion.habitacionId) {
      this.mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    console.log('Contratando servicio:', {
      servicio: this.servicioAContratar,
      datos: this.datosContratacion,
    });

    this.mostrarMensaje(
      `Servicio "${this.servicioAContratar.nombre}" contratado exitosamente`,
      'exito'
    );
    this.cerrarModalContratar();
  }

  confirmarEliminacion(servicio: Servicio): void {
    this.servicioAEliminar = servicio;
  }

  cancelarEliminacion(): void {
    this.servicioAEliminar = null;
  }

  eliminarServicio(): void {
    if (!this.servicioAEliminar) return;

    this.serviciosService.delete(this.servicioAEliminar.idServicio).subscribe({
      next: () => {
        this.cargarServicios();
        this.servicioAEliminar = null;
        this.mostrarMensaje('Servicio eliminado correctamente', 'exito');
      },
      error: () => {
        this.mostrarMensaje('Error al eliminar el servicio', 'error');
        this.servicioAEliminar = null;
      },
    });
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'info' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 4000);
  }

  getTipoClass(tipo: string): string {
    const clases = {
      RESTAURANTE: 'tipo-restaurante',
      SPA: 'tipo-spa',
      LAVANDERIA: 'tipo-lavanderia',
      TRANSPORTE: 'tipo-transporte',
      ENTRETENIMIENTO: 'tipo-entretenimiento',
      OTROS: 'tipo-otros',
    };
    return clases[tipo as keyof typeof clases] || 'tipo-default';
  }

  getTipoIcon(tipo: string): string {
    const iconos = {
      RESTAURANTE: '🍽️',
      SPA: '🧖‍♀️',
      LAVANDERIA: '👔',
      TRANSPORTE: '🚗',
      ENTRETENIMIENTO: '🎮',
      OTROS: '🔧',
    };
    return iconos[tipo as keyof typeof iconos] || '📋';
  }

  formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString('es-ES')}`;
  }

  // ✅ NUEVO: calcula promedio seguro
  getPromedioCalificacion(servicio: Servicio): number {
    if (!servicio.comentarios || servicio.comentarios.length === 0) return 0;
    const suma = servicio.comentarios.reduce(
      (acc, comentario) => acc + (comentario.calificacion || 0),
      0
    );
    return suma / servicio.comentarios.length;
  }

  getCalificacionEstrellas(calificacion: number): string {
    const c = Math.min(5, Math.max(0, Math.round(calificacion)));
    return '★'.repeat(c) + '☆'.repeat(5 - c);
  }
}

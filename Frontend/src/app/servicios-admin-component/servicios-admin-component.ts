import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../Models/Servicio';
import { CRUDServiciosService } from '../service/servicios/CRUD/crudservicios-service';

@Component({
  selector: 'app-servicios-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-admin-component.html',
  styleUrl: './servicios-admin-component.css',
})
export class ServiciosAdminComponent {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  nuevoServicio: Servicio = this.crearNuevoServicio();
  editando: Servicio | null = null;

  // Filtros
  filtroBusqueda: string = '';
  categoriaBusqueda: string = 'nombre';

  // Modal
  modalAbierto: boolean = false;
  descripcionModal: boolean = false;
  servicioSeleccionado: Servicio | null = null;

  // Notificaciones
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' = 'exito';

  constructor(private servicioService: CRUDServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  private crearNuevoServicio(): Servicio {
    return {
      idServicio: 0,
      tipo: '',
      descripcion: '',
      nombre: '',
      precio: 0,
      imagenURL: '',
    };
  }

  // 🔹 Cargar servicios
  cargarServicios(): void {
    this.servicioService.findAll().subscribe({
      next: (data) => {
        this.servicios = data;
        this.serviciosFiltrados = data;
      },
      error: () => this.mostrarMensaje('Error al cargar servicios', 'error'),
    });
  }

  // 🔍 Filtrar servicios
  filtrarServicios(): void {
    const filtro = this.filtroBusqueda.toLowerCase().trim();

    this.serviciosFiltrados = this.servicios.filter((s) => {
      switch (this.categoriaBusqueda) {
        case 'id':
          return s.idServicio?.toString().includes(filtro);
        case 'nombre':
          return s.nombre?.toLowerCase().includes(filtro);
        case 'tipo':
          return s.tipo?.toLowerCase().includes(filtro);
        default:
          return true;
      }
    });
  }

  limpiarFiltro(): void {
    this.filtroBusqueda = '';
    this.categoriaBusqueda = 'nombre';
    this.serviciosFiltrados = this.servicios;
  }

  // Crear servicio
  crearServicio(): void {
    if (!this.nuevoServicio.nombre.trim() || !this.nuevoServicio.tipo.trim()) return;

    this.servicioService.create(this.nuevoServicio).subscribe({
      next: () => {
        this.cargarServicios();
        this.cerrarModal();
        this.mostrarMensaje('Servicio creado correctamente');
      },
      error: () => this.mostrarMensaje('Error al crear servicio', 'error'),
    });
  }

  // ✏️ Editar servicio
  editarServicio(servicio: Servicio): void {
    this.editando = { ...servicio };
  }

  guardarEdicion(): void {
    if (!this.editando) return;

    this.servicioService.update(this.editando.idServicio, this.editando).subscribe({
      next: () => {
        this.cargarServicios();
        this.editando = null;
        this.mostrarMensaje('Servicio actualizado correctamente');
      },
      error: () => this.mostrarMensaje('Error al actualizar servicio', 'error'),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  // 🗑️ Eliminar servicio
  eliminarServicio(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      this.servicioService.delete(id).subscribe({
        next: () => {
          this.cargarServicios();
          this.mostrarMensaje('Servicio eliminado correctamente');
        },
        error: () => this.mostrarMensaje('Error al eliminar servicio', 'error'),
      });
    }
  }

  // Ver descripción completa
  verDescripcion(servicio: Servicio): void {
    this.servicioSeleccionado = servicio;
    this.descripcionModal = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarDescripcionModal(): void {
    this.descripcionModal = false;
    this.servicioSeleccionado = null;
    document.body.style.overflow = 'auto';
  }

  // Notificaciones
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 2500);
  }

  // Control del modal
  abrirModal(): void {
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
    this.nuevoServicio = this.crearNuevoServicio();
  }
}

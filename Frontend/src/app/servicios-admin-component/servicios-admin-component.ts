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

  filtro: string = '';

  mensaje: string = '';
  mostrarMensaje: boolean = false;

  modalAbierto: boolean = false;

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
      error: (err) => console.error('Error al cargar servicios:', err),
    });
  }

  // 🔍 Filtrar servicios por nombre o tipo
  buscarServicios(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.serviciosFiltrados = this.servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(filtroLower) || s.tipo.toLowerCase().includes(filtroLower)
    );
  }

  limpiarFiltro(): void {
    this.filtro = '';
    this.serviciosFiltrados = [...this.servicios];
  }

  // 🟢 Crear servicio
  crearServicio(): void {
    if (!this.nuevoServicio.nombre.trim() || !this.nuevoServicio.tipo.trim()) return;

    this.servicioService.create(this.nuevoServicio).subscribe({
      next: () => {
        this.cargarServicios();
        this.cerrarModal();
        this.nuevoServicio = this.crearNuevoServicio();
        this.mostrarConfirmacion('✅ Servicio creado correctamente');
      },
      error: (err) => console.error('Error al crear servicio:', err),
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
        this.mostrarConfirmacion('✏️ Servicio actualizado correctamente');
      },
      error: (err) => console.error('Error al actualizar servicio:', err),
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
          this.mostrarConfirmacion('🗑️ Servicio eliminado correctamente');
        },
        error: (err) => console.error('Error al eliminar servicio:', err),
      });
    }
  }

  // 🔔 Mostrar mensaje tipo toast
  mostrarConfirmacion(mensaje: string): void {
    this.mensaje = mensaje;
    this.mostrarMensaje = true;
    setTimeout(() => (this.mostrarMensaje = false), 3000);
  }

  // 🪟 Control del modal
  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }
}

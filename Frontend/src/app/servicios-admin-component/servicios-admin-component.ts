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
  nuevoServicio: Servicio = this.crearNuevoServicio();
  editando: Servicio | null = null;

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

  cargarServicios(): void {
    this.servicioService.findAll().subscribe({
      next: (data) => (this.servicios = data),
      error: (err) => console.error('Error al cargar servicios:', err),
    });
  }

  crearServicio(): void {
    if (!this.nuevoServicio.nombre.trim() || !this.nuevoServicio.tipo.trim()) return;

    this.servicioService.create(this.nuevoServicio).subscribe({
      next: () => {
        this.cargarServicios();
        this.nuevoServicio = this.crearNuevoServicio();
      },
      error: (err) => console.error('Error al crear servicio:', err),
    });
  }

  editarServicio(servicio: Servicio): void {
    this.editando = { ...servicio };
  }

  guardarEdicion(): void {
    if (!this.editando) return;

    this.servicioService.update(this.editando.idServicio, this.editando).subscribe({
      next: () => {
        this.cargarServicios();
        this.editando = null;
      },
      error: (err) => console.error('Error al actualizar servicio:', err),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      this.servicioService.delete(id).subscribe({
        next: () => this.cargarServicios(),
        error: (err) => console.error('Error al eliminar servicio:', err),
      });
    }
  }
}

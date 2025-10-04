import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { TipoHabitacionService } from '../service/tipo-habitacion';

@Component({
  selector: 'app-tipo-habitacion-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-habitacion-admin-component.html',
  styleUrl: './tipo-habitacion-admin-component.css',
})
export class TipoHabitacionAdminComponent {
  tipos: TipoHabitacion[] = [];
  nuevoTipo: TipoHabitacion = { id: 0, nombre: '', descripcion: '' };
  editando: TipoHabitacion | null = null;

  constructor(private tipoHabitacionService: TipoHabitacionService) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.tipoHabitacionService.findAll().subscribe({
      next: (data) => (this.tipos = data),
      error: (err) => console.error('Error al cargar tipos de habitación:', err),
    });
  }

  crearTipo(): void {
    if (!this.nuevoTipo.nombre.trim() || !this.nuevoTipo.descripcion.trim()) return;

    this.tipoHabitacionService.create(this.nuevoTipo).subscribe({
      next: () => {
        this.cargarTiposHabitacion();
        this.nuevoTipo = { id: 0, nombre: '', descripcion: '' };
      },
      error: (err) => console.error('Error al crear tipo de habitación:', err),
    });
  }

  editarTipo(tipo: TipoHabitacion): void {
    this.editando = { ...tipo };
  }

  guardarEdicion(): void {
    if (!this.editando) return;

    this.tipoHabitacionService.update(this.editando).subscribe({
      next: () => {
        this.cargarTiposHabitacion();
        this.editando = null;
      },
      error: (err) => console.error('Error al actualizar tipo de habitación:', err),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarTipo(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este tipo de habitación?')) {
      this.tipoHabitacionService.delete(id).subscribe({
        next: () => this.cargarTiposHabitacion(),
        error: (err) => console.error('Error al eliminar tipo de habitación:', err),
      });
    }
  }
}

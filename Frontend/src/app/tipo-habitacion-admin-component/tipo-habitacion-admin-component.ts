import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { TipoHabitacionService } from '../service/tipo-habitacion';

@Component({
  selector: 'app-tipo-habitacion-admin-component',
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
    this.tipos = this.tipoHabitacionService.findAll();
  }

  crearTipo() {
    if (!this.nuevoTipo.nombre.trim() || !this.nuevoTipo.descripcion.trim()) return;
    this.tipoHabitacionService.create({ ...this.nuevoTipo });
    this.tipos = this.tipoHabitacionService.findAll(); // refrescar
    this.nuevoTipo = { id: 0, nombre: '', descripcion: '' };
  }

  editarTipo(tipo: TipoHabitacion) {
    this.editando = { ...tipo };
  }

  guardarEdicion() {
    if (!this.editando) return;
    this.tipoHabitacionService.update(this.editando);
    this.tipos = this.tipoHabitacionService.findAll(); // refrescar
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarTipo(id: number) {
    if (confirm('¿Seguro que deseas eliminar este tipo de habitación?')) {
      this.tipoHabitacionService.delete(id);
      this.tipos = this.tipoHabitacionService.findAll();
    }
  }
}

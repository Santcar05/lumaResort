import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { Habitacion } from '../Models/Habitacion';

@Component({
  selector: 'app-tipo-habitacion-admin-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-habitacion-admin-component.html',
  styleUrl: './tipo-habitacion-admin-component.css',
})
export class TipoHabitacionAdminComponent {
  tipos: TipoHabitacion[] = [
    { id: 1, nombre: 'Suite Presidencial', descripcion: 'La más exclusiva del resort' },
    { id: 2, nombre: 'Habitación Doble', descripcion: 'Cómoda y elegante para dos personas' },
  ];

  nuevoTipo: TipoHabitacion = { id: 0, nombre: '', descripcion: '' };
  editando: TipoHabitacion | null = null;

  crearTipo() {
    if (!this.nuevoTipo.nombre.trim() || !this.nuevoTipo.descripcion.trim()) return;
    const nuevo: TipoHabitacion = {
      ...this.nuevoTipo,
      id: this.tipos.length ? Math.max(...this.tipos.map((t) => t.id)) + 1 : 1,
    };
    this.tipos.push(nuevo);
    this.nuevoTipo = { id: 0, nombre: '', descripcion: '' };
  }

  editarTipo(tipo: TipoHabitacion) {
    this.editando = { ...tipo };
  }

  guardarEdicion() {
    if (!this.editando) return;
    const index = this.tipos.findIndex((t) => t.id === this.editando!.id);
    if (index !== -1) {
      this.tipos[index] = this.editando;
    }
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarTipo(id: number) {
    if (confirm('¿Seguro que deseas eliminar este tipo de habitación?')) {
      this.tipos = this.tipos.filter((t) => t.id !== id);
    }
  }
}

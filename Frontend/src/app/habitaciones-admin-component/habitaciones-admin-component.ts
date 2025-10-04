import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habitacion } from '../Models/Habitacion';
import { HabitacionService } from '../service/habitacion/habitacion-service';

@Component({
  selector: 'app-habitaciones-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitaciones-admin-component.html',
  styleUrl: './habitaciones-admin-component.css',
})
export class HabitacionesAdminComponent {
  habitaciones: Habitacion[] = [];
  nuevaHabitacion: Habitacion = {
    idHabitacion: 0,
    numero: '',
    precioPorNoche: 0,
    estado: '',
    capacidad: 1,
    descripcion: '',
    imagenUrl: '',
  };
  editando: Habitacion | null = null;

  constructor(private habitacionService: HabitacionService) {}

  ngOnInit(): void {
    this.habitaciones = this.habitacionService.findAll();
  }

  crearHabitacion() {
    if (!this.nuevaHabitacion.numero.trim() || !this.nuevaHabitacion.estado.trim()) return;
    this.habitacionService.create({ ...this.nuevaHabitacion });
    this.habitaciones = this.habitacionService.findAll();
    this.nuevaHabitacion = {
      idHabitacion: 0,
      numero: '',
      precioPorNoche: 0,
      estado: '',
      capacidad: 1,
      descripcion: '',
      imagenUrl: '',
    };
  }

  editarHabitacion(habitacion: Habitacion) {
    this.editando = { ...habitacion };
  }

  guardarEdicion() {
    if (!this.editando) return;
    this.habitacionService.update(this.editando);
    this.habitaciones = this.habitacionService.findAll();
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarHabitacion(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta habitación?')) {
      this.habitacionService.delete(id);
      this.habitaciones = this.habitacionService.findAll();
    }
  }
}

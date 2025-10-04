import { Injectable } from '@angular/core';
import { Habitacion } from '../../Models/Habitacion';

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  private habitaciones: Habitacion[] = [];
  private nextId = 1;

  findAll(): Habitacion[] {
    return [...this.habitaciones];
  }

  create(habitacion: Habitacion) {
    habitacion.idHabitacion = this.nextId++;
    habitacion.imagenUrl = habitacion.imagenUrl || '';
    this.habitaciones.push({ ...habitacion }); // ✅ Ahora sí se agrega
  }

  update(habitacionActualizada: Habitacion) {
    const index = this.habitaciones.findIndex(
      (h) => h.idHabitacion === habitacionActualizada.idHabitacion
    );
    if (index !== -1) this.habitaciones[index] = { ...habitacionActualizada };
  }

  delete(id: number) {
    this.habitaciones = this.habitaciones.filter((h) => h.idHabitacion !== id);
  }
}

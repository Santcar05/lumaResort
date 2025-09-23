import { Injectable } from '@angular/core';
import { TipoHabitacion } from '../Models/TipoHabitacion';

@Injectable({
  providedIn: 'root',
})
export class TipoHabitacionService {
  private storageKey = 'tiposHabitacion'; // clave para el localStorage

  constructor() {
    // si no hay nada en localStorage, inicializamos con datos por defecto
    if (!localStorage.getItem(this.storageKey)) {
      const iniciales: TipoHabitacion[] = [
        { id: 1, nombre: 'Suite Presidencial', descripcion: 'La más exclusiva del resort' },
        { id: 2, nombre: 'Habitación Doble', descripcion: 'Cómoda y elegante para dos personas' },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(iniciales));
    }
  }

  private getData(): TipoHabitacion[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private saveData(data: TipoHabitacion[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  findAll(): TipoHabitacion[] {
    return this.getData();
  }

  create(tipo: TipoHabitacion): void {
    const data = this.getData();
    tipo.id = data.length ? Math.max(...data.map((t) => t.id)) + 1 : 1;
    data.push(tipo);
    this.saveData(data);
  }

  update(tipo: TipoHabitacion): void {
    const data = this.getData();
    const index = data.findIndex((t) => t.id === tipo.id);
    if (index !== -1) {
      data[index] = tipo;
      this.saveData(data);
    }
  }

  delete(id: number): void {
    const data = this.getData().filter((t) => t.id !== id);
    this.saveData(data);
  }
}

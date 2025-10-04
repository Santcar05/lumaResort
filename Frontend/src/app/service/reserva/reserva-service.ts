import { Injectable } from '@angular/core';
import { Reserva } from '../../Models/Reserva';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private storageKey = 'reservas';
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && !!window.localStorage;

    if (this.isBrowser && !localStorage.getItem(this.storageKey)) {
      const iniciales: Reserva[] = [];
      localStorage.setItem(this.storageKey, JSON.stringify(iniciales));
    }
  }

  private getData(): Reserva[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private saveData(data: Reserva[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  findAll(): Reserva[] {
    return this.getData();
  }

  create(reserva: Reserva): void {
    const data = this.getData();
    reserva.idReserva = data.length ? Math.max(...data.map((r) => r.idReserva)) + 1 : 1;
    data.push(reserva);
    this.saveData(data);
  }

  update(reserva: Reserva): void {
    const data = this.getData();
    const index = data.findIndex((r) => r.idReserva === reserva.idReserva);
    if (index !== -1) {
      data[index] = reserva;
      this.saveData(data);
    }
  }

  delete(id: number): void {
    const data = this.getData().filter((r) => r.idReserva !== id);
    this.saveData(data);
  }
}

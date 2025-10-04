import { Injectable } from '@angular/core';
import { Servicio } from '../../../Models/Servicio';

@Injectable({
  providedIn: 'root',
})
export class CRUDServiciosService {
  private servicios: Servicio[] = [];
  private nextId = 1;

  findAll(): Servicio[] {
    return [...this.servicios];
  }

  create(servicio: Servicio) {
    servicio.idServicio = this.nextId++;
    this.servicios.push({ ...servicio });
  }

  update(servicioActualizado: Servicio) {
    const index = this.servicios.findIndex((s) => s.idServicio === servicioActualizado.idServicio);
    if (index !== -1) this.servicios[index] = { ...servicioActualizado };
  }

  delete(id: number) {
    this.servicios = this.servicios.filter((s) => s.idServicio !== id);
  }
}

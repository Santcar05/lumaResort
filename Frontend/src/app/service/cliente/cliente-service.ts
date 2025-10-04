import { Injectable } from '@angular/core';
import { Usuario } from '../../Models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private storageKey = 'clientes';
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && !!window.localStorage;

    if (this.isBrowser && !localStorage.getItem(this.storageKey)) {
      const iniciales: Usuario[] = [
        {
          idUsuario: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@example.com',
          contrasena: '123456',
          cedula: '100200300',
          telefono: '3001234567',
          esOperador: false,
          esAdministrador: false,
          rol: 'Cliente',
        },
        {
          idUsuario: 2,
          nombre: 'María',
          apellido: 'Gómez',
          correo: 'maria.gomez@example.com',
          contrasena: 'abcdef',
          cedula: '200300400',
          telefono: '3019876543',
          esOperador: false,
          esAdministrador: false,
          rol: 'Cliente',
        },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(iniciales));
    }
  }

  private getData(): Usuario[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private saveData(data: Usuario[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  findAll(): Usuario[] {
    return this.getData();
  }

  create(cliente: Usuario): void {
    const data = this.getData();
    cliente.idUsuario = data.length ? Math.max(...data.map((c) => c.idUsuario)) + 1 : 1;
    data.push(cliente);
    this.saveData(data);
  }

  update(cliente: Usuario): void {
    const data = this.getData();
    const index = data.findIndex((c) => c.idUsuario === cliente.idUsuario);
    if (index !== -1) {
      data[index] = cliente;
      this.saveData(data);
    }
  }

  delete(id: number): void {
    const data = this.getData().filter((c) => c.idUsuario !== id);
    this.saveData(data);
  }
}

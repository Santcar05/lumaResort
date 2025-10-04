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
  nuevoServicio: Servicio = {
    idServicio: 0,
    tipo: '',
    descripcion: '',
    nombre: '',
    precio: 0,
    imagenURL: '',
  };
  editando: Servicio | null = null;

  constructor(private servicioService: CRUDServiciosService) {}

  ngOnInit(): void {
    this.servicios = this.servicioService.findAll();
  }

  crearServicio() {
    if (!this.nuevoServicio.nombre.trim() || !this.nuevoServicio.tipo.trim()) return;
    this.servicioService.create({ ...this.nuevoServicio });
    this.servicios = this.servicioService.findAll();
    this.nuevoServicio = {
      idServicio: 0,
      tipo: '',
      descripcion: '',
      nombre: '',
      precio: 0,
      imagenURL: '',
    };
  }

  editarServicio(servicio: Servicio) {
    this.editando = { ...servicio };
  }

  guardarEdicion() {
    if (!this.editando) return;
    this.servicioService.update(this.editando);
    this.servicios = this.servicioService.findAll();
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarServicio(id: number) {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      this.servicioService.delete(id);
      this.servicios = this.servicioService.findAll();
    }
  }
}

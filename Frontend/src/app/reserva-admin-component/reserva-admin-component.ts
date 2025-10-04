import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../Models/Reserva';
import { ReservaService } from '../service/reserva/reserva-service';

@Component({
  selector: 'app-reserva-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-admin-component.html',
  styleUrl: './reserva-admin-component.css',
})
export class ReservaAdminComponent {
  habitaciones = [
    { idHabitacion: 1, numero: '101', tipo: 'Suite', precioPorNoche: 300 },
    { idHabitacion: 2, numero: '102', tipo: 'Doble', precioPorNoche: 200 },
    { idHabitacion: 3, numero: '103', tipo: 'Individual', precioPorNoche: 150 },
  ];

  usuarios = [
    { idUsuario: 1, nombre: 'Juan Pérez', rol: 'Cliente' },
    { idUsuario: 2, nombre: 'María Gómez', rol: 'Cliente' },
    { idUsuario: 3, nombre: 'Carlos Ruiz', rol: 'Cliente' },
  ];

  reservas: Reserva[] = [];
  nuevaReserva: Reserva = {
    idReserva: 0,
    fechaInicio: '',
    fechaFin: '',
    cantidadPersonas: 1,
    estado: 'Pendiente',
    cliente: {
      idUsuario: 0,
      nombre: '',
      apellido: '',
      correo: '',
      contrasena: '',
      cedula: '',
      telefono: '',
      esOperador: false,
      esAdministrador: false,
      rol: 'Cliente',
    },
    habitacion: {
      idHabitacion: 0,
      numero: '',
      precioPorNoche: 0,
      estado: 'Disponible',
      capacidad: 1,
      descripcion: '',
    },
  };
  editando: Reserva | null = null;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.reservas = this.reservaService.findAll();
  }

  crearReserva() {
    if (!this.nuevaReserva.cliente || !this.nuevaReserva.habitacion) return;
    this.reservaService.create({ ...this.nuevaReserva });
    this.reservas = this.reservaService.findAll();
    this.resetFormulario();
  }

  resetFormulario() {
    this.nuevaReserva = {
      idReserva: 0,
      fechaInicio: '',
      fechaFin: '',
      cantidadPersonas: 1,
      estado: 'Pendiente',
      cliente: {
        idUsuario: 0,
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        cedula: '',
        telefono: '',
        esOperador: false,
        esAdministrador: false,
        rol: 'Cliente',
      },
      habitacion: {
        idHabitacion: 0,
        numero: '',
        precioPorNoche: 0,
        estado: 'Disponible',
        capacidad: 1,
        descripcion: '',
      },
    };
  }

  editarReserva(reserva: Reserva) {
    this.editando = { ...reserva };
  }

  guardarEdicion() {
    if (!this.editando) return;
    this.reservaService.update(this.editando);
    this.reservas = this.reservaService.findAll();
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarReserva(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
      this.reservaService.delete(id);
      this.reservas = this.reservaService.findAll();
    }
  }
}

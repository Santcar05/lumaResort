import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../Models/Reserva';
import { ReservaService } from '../service/reserva/reserva-service';

@Component({
  selector: 'app-reserva-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-admin-component.html',
  styleUrls: ['./reserva-admin-component.css'],
})
export class ReservaAdminComponent implements OnInit {
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
  nuevaReserva: Reserva = this.crearReservaVacia();
  editando: Reserva | null = null;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  // 🔹 Cargar todas las reservas desde el backend
  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => (this.reservas = data),
      error: (err) => console.error('Error al cargar reservas:', err),
    });
  }

  // 🔹 Crear una nueva reserva
  crearReserva(): void {
    if (!this.nuevaReserva.cliente || !this.nuevaReserva.habitacion) return;

    this.reservaService.create(this.nuevaReserva).subscribe({
      next: () => {
        this.cargarReservas();
        this.resetFormulario();
      },
      error: (err) => console.error('Error al crear reserva:', err),
    });
  }

  // 🔹 Guardar cambios en una reserva editada
  guardarEdicion(): void {
    if (!this.editando) return;

    this.reservaService.update(this.editando).subscribe({
      next: () => {
        this.cargarReservas();
        this.editando = null;
      },
      error: (err) => console.error('Error al actualizar reserva:', err),
    });
  }

  // 🔹 Eliminar una reserva
  eliminarReserva(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
      this.reservaService.delete(id).subscribe({
        next: () => this.cargarReservas(),
        error: (err) => console.error('Error al eliminar reserva:', err),
      });
    }
  }

  // 🔹 Cancelar edición
  cancelarEdicion(): void {
    this.editando = null;
  }

  // 🔹 Seleccionar reserva para editar
  editarReserva(reserva: Reserva): void {
    this.editando = { ...reserva };
  }

  // 🔹 Limpiar formulario
  resetFormulario(): void {
    this.nuevaReserva = this.crearReservaVacia();
  }

  // 🔹 Crear plantilla vacía para una nueva reserva
  private crearReservaVacia(): Reserva {
    return {
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
      servicios: [],
    };
  }
}

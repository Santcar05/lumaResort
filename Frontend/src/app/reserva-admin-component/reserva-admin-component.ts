import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  idUsuario: number;
  nombre: string;
  rol: string;
}

interface Habitacion {
  idHabitacion: number;
  numero: string;
  precioPorNoche?: number;
}

interface Reserva {
  idReserva: number;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
  estado: string;
  usuario: Usuario;
  habitacion: Habitacion;
  servicios?: any[];
}

@Component({
  selector: 'app-reserva-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-admin-component.html',
  styleUrls: ['./reserva-admin-component.css'],
})
export class ReservaAdminComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  nuevaReserva: Reserva = this.crearReservaVacia();
  editando: Reserva | null = null;

  filtro: string = '';
  criterio: string = 'cliente'; // criterio por defecto: cliente

  mensaje: string = '';
  mostrarMensaje: boolean = false;

  modalAbierto: boolean = false;

  ngOnInit(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.reservas = [
      {
        idReserva: 1,
        fechaInicio: '2025-11-20',
        fechaFin: '2025-11-25',
        cantidadPersonas: 2,
        estado: 'Pendiente',
        usuario: { idUsuario: 1, nombre: 'Juan Pérez', rol: 'Cliente' },
        habitacion: { idHabitacion: 101, numero: '101', precioPorNoche: 300 },
      },
      {
        idReserva: 2,
        fechaInicio: '2025-12-01',
        fechaFin: '2025-12-05',
        cantidadPersonas: 1,
        estado: 'Confirmada',
        usuario: { idUsuario: 2, nombre: 'María Gómez', rol: 'Cliente' },
        habitacion: { idHabitacion: 102, numero: '102', precioPorNoche: 200 },
      },
    ];
    this.reservasFiltradas = [...this.reservas];
  }

  buscarReservas(): void {
    const filtroLower = this.filtro.toLowerCase();

    this.reservasFiltradas = this.reservas.filter((r) => {
      switch (this.criterio) {
        case 'cliente':
          return r.usuario.nombre.toLowerCase().includes(filtroLower);
        case 'id':
          return r.idReserva.toString().includes(filtroLower);
        case 'habitacion':
          return r.habitacion.numero.toLowerCase().includes(filtroLower);
        case 'estado':
          return r.estado.toLowerCase().includes(filtroLower);
        default:
          return true;
      }
    });
  }

  limpiarFiltro(): void {
    this.filtro = '';
    this.reservasFiltradas = [...this.reservas];
  }

  crearReserva(): void {
    if (
      !this.nuevaReserva.usuario.nombre.trim() ||
      !this.nuevaReserva.habitacion.numero.trim() ||
      !this.nuevaReserva.fechaInicio ||
      !this.nuevaReserva.fechaFin ||
      this.nuevaReserva.cantidadPersonas < 1
    ) {
      this.mostrarConfirmacion('❌ Completa todos los campos obligatorios');
      return;
    }

    const nuevoId = this.reservas.length
      ? Math.max(...this.reservas.map((r) => r.idReserva)) + 1
      : 1;
    this.nuevaReserva.idReserva = nuevoId;

    this.reservas.push({ ...this.nuevaReserva });
    this.reservasFiltradas = [...this.reservas];
    this.nuevaReserva = this.crearReservaVacia();
    this.cerrarModal();
    this.mostrarConfirmacion('✅ Reserva creada correctamente');
  }

  editarReserva(reserva: Reserva): void {
    this.editando = { ...reserva };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const index = this.reservas.findIndex((r) => r.idReserva === this.editando!.idReserva);
    if (index !== -1) {
      this.reservas[index] = { ...this.editando };
      this.reservasFiltradas = [...this.reservas];
      this.editando = null;
      this.mostrarConfirmacion('✏️ Reserva actualizada correctamente');
    }
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarReserva(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
      this.reservas = this.reservas.filter((r) => r.idReserva !== id);
      this.reservasFiltradas = [...this.reservas];
      this.mostrarConfirmacion('🗑️ Reserva eliminada correctamente');
    }
  }

  mostrarConfirmacion(texto: string): void {
    this.mensaje = texto;
    this.mostrarMensaje = true;
    setTimeout(() => (this.mostrarMensaje = false), 3000);
  }

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  private crearReservaVacia(): Reserva {
    return {
      idReserva: 0,
      fechaInicio: '',
      fechaFin: '',
      cantidadPersonas: 1,
      estado: 'Pendiente',
      usuario: { idUsuario: 0, nombre: '', rol: 'Cliente' },
      habitacion: { idHabitacion: 0, numero: '', precioPorNoche: 0 },
      servicios: [],
    };
  }
}

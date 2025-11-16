import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../services/reserva.service';

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

  // Filtros unificados
  filtroBusqueda: string = '';
  categoriaBusqueda: string = 'cliente';
  filtroEstado: string = '';

  // Modal
  modalAbierto: boolean = false;

  // Notificaciones unificadas
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' = 'exito';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  // Cargar reservas desde backend
  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
      },
      error: () => this.mostrarMensaje('Error al cargar reservas', 'error'),
    });
  }

  // Filtrado combinado
  filtrarReservas(): void {
    const filtro = this.filtroBusqueda.toLowerCase().trim();
    const estado = this.filtroEstado.toLowerCase().trim();

    this.reservasFiltradas = this.reservas.filter((r) => {
      let coincideCategoria = false;

      switch (this.categoriaBusqueda) {
        case 'id':
          coincideCategoria = r.idReserva.toString().includes(filtro);
          break;
        case 'cliente':
          coincideCategoria = r.usuario.nombre.toLowerCase().includes(filtro);
          break;
        case 'habitacion':
          coincideCategoria = r.habitacion.numero.toLowerCase().includes(filtro);
          break;
      }

      const coincideEstado = !estado || r.estado.toLowerCase() === estado;

      return coincideCategoria && coincideEstado;
    });
  }

  limpiarFiltro(): void {
    this.filtroBusqueda = '';
    this.categoriaBusqueda = 'cliente';
    this.filtroEstado = '';
    this.reservasFiltradas = this.reservas;
  }

  // Modal
  abrirModal(): void {
    this.modalAbierto = true;
    this.nuevaReserva = this.crearReservaVacia();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  // Notificaciones
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 2500);
  }

  // Crear reserva
  crearReserva(): void {
    if (
      !this.nuevaReserva.usuario.nombre.trim() ||
      !this.nuevaReserva.habitacion.numero.trim() ||
      !this.nuevaReserva.fechaInicio ||
      !this.nuevaReserva.fechaFin ||
      this.nuevaReserva.cantidadPersonas < 1
    ) {
      this.mostrarMensaje('Completa todos los campos obligatorios', 'error');
      return;
    }

    this.reservaService.create(this.nuevaReserva).subscribe({
      next: () => {
        this.cargarReservas();
        this.cerrarModal();
        this.mostrarMensaje('Reserva creada correctamente', 'exito');
      },
      error: () => this.mostrarMensaje('Error al crear reserva', 'error'),
    });
  }

  // Seleccionar reserva para editar
  editarReserva(reserva: Reserva): void {
    this.editando = { ...reserva };
    this.abrirModal();
    this.nuevaReserva = this.editando;
  }

  // Guardar edición
  guardarEdicion(): void {
    if (!this.editando) return;

    this.reservaService.update(this.editando).subscribe({
      next: () => {
        this.cargarReservas();
        this.editando = null;
        this.cerrarModal();
        this.mostrarMensaje('Reserva actualizada correctamente', 'exito');
      },
      error: () => this.mostrarMensaje('Error al actualizar reserva', 'error'),
    });
  }

  // Eliminar reserva
  eliminarReserva(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta reserva?')) return;

    this.reservaService.delete(id).subscribe({
      next: () => {
        this.cargarReservas();
        this.mostrarMensaje('Reserva eliminada correctamente', 'exito');
      },
      error: () => this.mostrarMensaje('Error al eliminar reserva', 'error'),
    });
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
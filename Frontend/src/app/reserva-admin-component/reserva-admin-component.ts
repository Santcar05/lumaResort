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
  reservasFiltradas: Reserva[] = [];
  nuevaReserva: Reserva = this.crearReservaVacia();
  editando: Reserva | null = null;

  // Filtros
  filtroBusqueda: string = '';
  categoriaBusqueda: string = 'cliente';
  filtroEstado: string = '';

  // Modal
  modalAbierto: boolean = false;

  // Notificaciones
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' = 'exito';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  // 🔹 Cargar todas las reservas desde el backend
  cargarReservas(): void {
    this.reservaService.findAll().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
      },
      error: () => this.mostrarMensaje('Error al cargar reservas', 'error'),
    });
  }

  // 🔹 Filtrar reservas
  filtrarReservas(): void {
    const filtro = this.filtroBusqueda.toLowerCase().trim();
    const estadoSeleccionado = this.filtroEstado.toLowerCase().trim();

    this.reservasFiltradas = this.reservas.filter((r) => {
      let coincideCategoria = false;

      if (this.categoriaBusqueda === 'id') {
        coincideCategoria = r.idReserva?.toString().includes(filtro);
      } else if (this.categoriaBusqueda === 'cliente') {
        coincideCategoria = r.usuario.nombre?.toLowerCase().includes(filtro);
      } else if (this.categoriaBusqueda === 'habitacion') {
        coincideCategoria = r.habitacion.numero?.toLowerCase().includes(filtro);
      }

      const coincideEstado = !estadoSeleccionado || r.estado?.toLowerCase() === estadoSeleccionado;

      return coincideCategoria && coincideEstado;
    });
  }

  limpiarFiltro(): void {
    this.filtroBusqueda = '';
    this.categoriaBusqueda = 'cliente';
    this.filtroEstado = '';
    this.reservasFiltradas = this.reservas;
  }

  // 🔹 Modal
  abrirModal(): void {
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
    this.resetFormulario();
  }

  // 🔹 Notificaciones
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 2500);
  }

  // 🔹 Crear una nueva reserva
  crearReserva(): void {
    if (!this.nuevaReserva.usuario || !this.nuevaReserva.habitacion) return;

    this.reservaService.create(this.nuevaReserva).subscribe({
      next: () => {
        this.cargarReservas();
        this.cerrarModal();
        this.mostrarMensaje('Reserva creada correctamente');
      },
      error: () => this.mostrarMensaje('Error al crear reserva', 'error'),
    });
  }

  // 🔹 Guardar cambios en una reserva editada
  guardarEdicion(): void {
    if (!this.editando) return;

    this.reservaService.update(this.editando).subscribe({
      next: () => {
        this.cargarReservas();
        this.editando = null;
        this.mostrarMensaje('Reserva actualizada correctamente');
      },
      error: () => this.mostrarMensaje('Error al actualizar reserva', 'error'),
    });
  }

  // 🔹 Eliminar una reserva
  eliminarReserva(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
      this.reservaService.delete(id).subscribe({
        next: () => {
          this.cargarReservas();
          this.mostrarMensaje('Reserva eliminada correctamente');
        },
        error: () => this.mostrarMensaje('Error al eliminar reserva', 'error'),
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
      usuario: {
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

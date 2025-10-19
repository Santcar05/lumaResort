import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../Models/Usuario';
import { ClienteService } from '../service/cliente/cliente-service';

@Component({
  selector: 'app-cliente-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-admin-component.html',
  styleUrls: ['./cliente-admin-component.css'],
})
export class ClienteAdminComponent implements OnInit {
  clientes: Usuario[] = [];
  clientesFiltrados: Usuario[] = [];
  nuevoCliente: Usuario = this.crearNuevoUsuario();
  editando: Usuario | null = null;

  // 🔍 Filtros
  filtroBusqueda: string = '';
  categoriaBusqueda: string = 'nombre';

  // 🪟 Modal
  modalAbierto: boolean = false;

  // 🔔 Notificaciones flotantes
  mensaje: string = '';
  mostrarNotificacion: boolean = false;
  tipoNotificacion: 'exito' | 'error' = 'exito';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // 🧩 Crear objeto base de usuario
  private crearNuevoUsuario(): Usuario {
    return {
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
    };
  }

  // 📥 Cargar lista de clientes
  cargarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
      },
      error: () => this.mostrarMensaje('Error al cargar clientes', 'error'),
    });
  }

  // 🔍 Filtros dinámicos
  filtrarClientes(): void {
    const filtro = this.filtroBusqueda.toLowerCase().trim();

    this.clientesFiltrados = this.clientes.filter((c) => {
      switch (this.categoriaBusqueda) {
        case 'nombre':
          return c.nombre?.toLowerCase().includes(filtro);
        case 'apellido':
          return c.apellido?.toLowerCase().includes(filtro);
        case 'correo':
          return c.correo?.toLowerCase().includes(filtro);
        case 'id':
          return c.idUsuario?.toString().includes(filtro);
        case 'cedula':
          return c.cedula?.toLowerCase().includes(filtro);
        case 'telefono':
          return c.telefono?.toLowerCase().includes(filtro);
        default:
          return true;
      }
    });
  }

  limpiarFiltro(): void {
    this.filtroBusqueda = '';
    this.categoriaBusqueda = 'nombre';
    this.clientesFiltrados = this.clientes;
  }

  // 🪟 MODAL
  abrirModal(): void {
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden'; // evita que se mueva el fondo
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
    this.nuevoCliente = this.crearNuevoUsuario();
  }

  // 🔔 NOTIFICACIONES
  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoNotificacion = tipo;
    this.mostrarNotificacion = true;
    setTimeout(() => (this.mostrarNotificacion = false), 2500);
  }

  // 🧱 CRUD OPERATIONS
  crearCliente(): void {
    if (!this.nuevoCliente.nombre.trim() || !this.nuevoCliente.apellido.trim()) return;

    this.clienteService.create(this.nuevoCliente).subscribe({
      next: () => {
        this.cargarClientes();
        this.cerrarModal();
        this.mostrarMensaje('Cliente creado correctamente');
      },
      error: () => this.mostrarMensaje('Error al crear cliente', 'error'),
    });
  }

  editarCliente(cliente: Usuario): void {
    this.editando = { ...cliente };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    this.clienteService.update(this.editando).subscribe({
      next: () => {
        this.cargarClientes();
        this.editando = null;
        this.mostrarMensaje('Cliente actualizado correctamente');
      },
      error: () => this.mostrarMensaje('Error al actualizar cliente', 'error'),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.cargarClientes();
          this.mostrarMensaje('Cliente eliminado correctamente');
        },
        error: () => this.mostrarMensaje('Error al eliminar cliente', 'error'),
      });
    }
  }
}

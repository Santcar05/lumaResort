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
  nuevoCliente: Usuario = this.crearNuevoUsuario();
  editando: Usuario | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // 🔹 Crear una plantilla de usuario vacío
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

  // 🔹 Cargar lista de clientes desde el backend
  cargarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error al cargar clientes:', err),
    });
  }

  // 🔹 Crear nuevo cliente
  crearCliente(): void {
    if (!this.nuevoCliente.nombre.trim() || !this.nuevoCliente.apellido.trim()) return;

    this.clienteService.create(this.nuevoCliente).subscribe({
      next: () => {
        this.cargarClientes();
        this.nuevoCliente = this.crearNuevoUsuario();
      },
      error: (err) => console.error('Error al crear cliente:', err),
    });
  }

  // 🔹 Seleccionar cliente para edición
  editarCliente(cliente: Usuario): void {
    this.editando = { ...cliente };
  }

  // 🔹 Guardar cambios en cliente editado
  guardarEdicion(): void {
    if (!this.editando) return;

    this.clienteService.update(this.editando).subscribe({
      next: () => {
        this.cargarClientes();
        this.editando = null;
      },
      error: (err) => console.error('Error al actualizar cliente:', err),
    });
  }

  // 🔹 Cancelar edición
  cancelarEdicion(): void {
    this.editando = null;
  }

  // 🔹 Eliminar cliente
  eliminarCliente(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => this.cargarClientes(),
        error: (err) => console.error('Error al eliminar cliente:', err),
      });
    }
  }
}

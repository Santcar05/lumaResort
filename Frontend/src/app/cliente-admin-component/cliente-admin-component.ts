import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../Models/Usuario';
import { ClienteService } from '../service/cliente/cliente-service';

@Component({
  selector: 'app-cliente-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-admin-component.html',
  styleUrl: './cliente-admin-component.css',
})
export class ClienteAdminComponent {
  clientes: Usuario[] = [];
  nuevoCliente: Usuario = {
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
  editando: Usuario | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clientes = this.clienteService.findAll();
  }

  crearCliente() {
    if (!this.nuevoCliente.nombre.trim() || !this.nuevoCliente.apellido.trim()) return;
    this.clienteService.create({ ...this.nuevoCliente });
    this.clientes = this.clienteService.findAll();
    this.nuevoCliente = {
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

  editarCliente(cliente: Usuario) {
    this.editando = { ...cliente };
  }

  guardarEdicion() {
    if (!this.editando) return;
    this.clienteService.update(this.editando);
    this.clientes = this.clienteService.findAll();
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.delete(id);
      this.clientes = this.clienteService.findAll();
    }
  }
}

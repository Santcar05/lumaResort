import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../service/cliente/cliente-service';
import { Usuario } from '../Models/Usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../generales-components/header-component/header-component';

@Component({
  selector: 'app-perfil-component',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './perfil-component.html',
  styleUrls: ['./perfil-component.css'],
})
export class PerfilComponent implements OnInit {
  usuario?: Usuario;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idUsuario = this.route.snapshot.params['id'];
    if (idUsuario) {
      this.clienteService.findByUsuarioId(idUsuario).subscribe((data: Usuario) => {
        this.usuario = data;
      });
    }
  }

  actualizarCliente(): void {
    if (this.usuario) {
      this.clienteService.update(this.usuario).subscribe(() => {
        alert('Perfil actualizado con éxito');
        this.router.navigate(['/']);
      });
    }
  }
}

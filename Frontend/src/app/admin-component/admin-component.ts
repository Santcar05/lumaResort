import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoHabitacionAdminComponent } from '../tipo-habitacion-admin-component/tipo-habitacion-admin-component';

@Component({
  selector: 'app-admin-component',
  imports: [CommonModule, TipoHabitacionAdminComponent],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {}

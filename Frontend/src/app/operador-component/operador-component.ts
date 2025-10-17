import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavOperadorComponent } from '../nav-operador-component/nav-operador-component';

@Component({
  selector: 'app-operador-component',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavOperadorComponent],
  templateUrl: './operador-component.html',
  styleUrls: ['./operador-component.css'],
})
export class OperadorComponent {}

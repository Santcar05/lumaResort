import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaDescubrimientoComponent } from '../../tarjetas-descubrimiento-component/tarjetas-descubrimiento-component.component';

@Component({
  selector: 'app-descubrimiento-component',
  standalone: true,
  imports: [CommonModule, TarjetaDescubrimientoComponent],
  templateUrl: './descubrimiento-component.html',
  styleUrls: ['./descubrimiento-component.css'],
})
export class DescubrimientoComponent {}

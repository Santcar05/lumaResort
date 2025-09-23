import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-descubrimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjetas-descubrimiento-component.component.html',
  styleUrl: './tarjetas-descubrimiento-component.component.css',
})
export class TarjetaDescubrimientoComponent {
  @Input() iconPath: string = ''; // ruta del <path> del SVG
  @Input() title: string = ''; // título de la tarjeta
  @Input() description: string = ''; // texto de la tarjeta
}

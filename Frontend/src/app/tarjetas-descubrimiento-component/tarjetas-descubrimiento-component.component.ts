import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta-descubrimiento',
  standalone: true,
  templateUrl: './tarjeta-descubrimiento.component.html',
  styleUrl: './tarjeta-descubrimiento.component.css',
})
export class TarjetaDescubrimientoComponent {
  @Input() iconPath: string = ''; // ruta del <path> del SVG
  @Input() title: string = ''; // título de la tarjeta
  @Input() description: string = ''; // texto de la tarjeta
}

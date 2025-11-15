import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-tarjeta-descubrimiento',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './tarjetas-descubrimiento-component.component.html',
  styleUrls: ['./tarjetas-descubrimiento-component.component.css'],
})
export class TarjetaDescubrimientoComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}

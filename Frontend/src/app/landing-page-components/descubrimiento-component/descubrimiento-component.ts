import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaDescubrimientoComponent } from '../../tarjetas-descubrimiento-component/tarjetas-descubrimiento-component.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-descubrimiento-component',
  standalone: true,
  imports: [CommonModule, TarjetaDescubrimientoComponent, TranslateModule, RouterModule],
  templateUrl: './descubrimiento-component.html',
  styleUrls: ['./descubrimiento-component.css'],
})
export class DescubrimientoComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    // Siempre ir al inicio al cargar
    window.scrollTo({ top: 0, behavior: 'instant' });

    // ⭐ Escucha cambios de ruta y resetea scroll al top
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
}

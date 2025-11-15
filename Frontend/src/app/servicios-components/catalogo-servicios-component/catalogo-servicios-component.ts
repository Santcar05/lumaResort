import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CRUDServiciosService } from '../../service/servicios/CRUD/crudservicios-service';
import { Servicio } from '../../Models/Servicio';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-catalogo-servicios-component',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './catalogo-servicios-component.html',
  styleUrls: ['./catalogo-servicios-component.css'],
})
export class CatalogoServiciosComponent implements OnInit {
  servicesCards: Servicio[] = [];
  loading = false;
  error: string | null = null;

  // Número máximo de servicios a mostrar
  readonly maxToShow = 5;

  constructor(private serviciosService: CRUDServiciosService) {}

  ngOnInit(): void {
    this.loadTopServices();
  }

  private loadTopServices(): void {
    this.loading = true;
    this.error = null;

    this.serviciosService
      .findAll()
      .pipe(
        // Coger solo los primeros maxToShow
        map((arr) => (Array.isArray(arr) ? arr.slice(0, this.maxToShow) : [])),
        catchError((err) => {
          this.error = 'Error al cargar servicios';
          console.error('Error al obtener servicios:', err);
          return of([]);
        })
      )
      .subscribe((result) => {
        this.servicesCards = result;
        this.loading = false;
      });
  }
}

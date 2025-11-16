import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CRUDServiciosService } from '../../service/servicios/CRUD/crudservicios-service';
import { AutoTranslateService } from '../../service/translation/auto-translate-service';
import { Servicio } from '../../Models/Servicio';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of, Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-catalogo-servicios-component',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './catalogo-servicios-component.html',
  styleUrls: ['./catalogo-servicios-component.css'],
})
export class CatalogoServiciosComponent implements OnInit, OnDestroy {
  servicesCards: Servicio[] = [];
  translatedServices: Map<number, { nombre: string; descripcion: string }> = new Map();
  loading = false;
  error: string | null = null;
  readonly maxToShow = 5;

  private langChangeSubscription?: Subscription;

  constructor(
    private serviciosService: CRUDServiciosService,
    private translate: TranslateService,
    private autoTranslate: AutoTranslateService
  ) {}

  ngOnInit(): void {
    this.loadTopServices();

    // Recargar traducciones cuando cambie el idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.translateAllServices(event.lang);
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  private loadTopServices(): void {
    this.loading = true;
    this.error = null;

    this.serviciosService
      .findAll()
      .pipe(
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

        // Traducir servicios al idioma actual
        const currentLang = this.translate.currentLang ?? this.translate.getDefaultLang() ?? 'es';
        if (currentLang !== 'es') this.translateAllServices(currentLang);
      });
  }

  /**
   * Traduce todos los servicios al idioma especificado
   */
  private translateAllServices(targetLang: string): void {
    if (targetLang === 'es') {
      // Si es español, limpiar traducciones
      this.translatedServices.clear();
      return;
    }

    // Traducir cada servicio
    this.servicesCards.forEach((service) => {
      this.translateService(service, targetLang);
    });
  }

  /**
   * Traduce un servicio individual
   */
  private translateService(service: Servicio, targetLang: string): void {
    // Traducir nombre y descripción en paralelo
    forkJoin({
      nombre: this.autoTranslate.translate(service.nombre, targetLang),
      descripcion: this.autoTranslate.translate(service.descripcion, targetLang),
    }).subscribe({
      next: (translations) => {
        this.translatedServices.set(service.idServicio!, translations);
      },
      error: (err) => {
        console.error(`Error traduciendo servicio ${service.idServicio}:`, err);
      },
    });
  }

  /**
   * Obtiene el nombre traducido del servicio
   */
  getTranslatedName(service: Servicio): string {
    const currentLang = this.translate.currentLang ?? this.translate.getDefaultLang() ?? 'es';
    if (currentLang === 'es') {
      return service.nombre;
    }
    return this.translatedServices.get(service.idServicio!)?.nombre || service.nombre;
  }

  /**
   * Obtiene la descripción traducida del servicio
   */
  getTranslatedDescription(service: Servicio): string {
    const currentLang = this.translate.currentLang ?? this.translate.getDefaultLang() ?? 'es';
    if (currentLang === 'es') {
      return service.descripcion;
    }
    return this.translatedServices.get(service.idServicio!)?.descripcion || service.descripcion;
  }
}

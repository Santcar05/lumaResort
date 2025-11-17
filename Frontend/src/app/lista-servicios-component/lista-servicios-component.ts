import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Subscription, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Servicio } from '../Models/Servicio';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { FooterComponent } from '../generales-components/footer-component/footer-component';
import { AutoTranslateService } from '../service/translation/auto-translate-service';

interface TranslatedService {
  nombre: string;
  descripcion: string;
  tipo: string;
}

@Component({
  selector: 'app-lista-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, TranslateModule],
  templateUrl: './lista-servicios-component.html',
  styleUrls: ['./lista-servicios-component.css'],
})
export class ListaServiciosComponent implements OnInit, OnDestroy {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  loading = true;
  translating = false;
  errorMsg = '';

  // Mapa de traducciones
  translatedServices: Map<number, TranslatedService> = new Map();

  // Filtros
  filtroTexto = '';
  filtroTipo = '';
  tiposUnicos: string[] = [];

  // Ordenamiento
  columnaOrden: 'nombre' | 'tipo' | 'precio' | '' = '';
  ordenAscendente = true;

  private baseUrl = 'https://backend-lumaresort.onrender.com/servicios';
  private langChangeSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private autoTranslate: AutoTranslateService
  ) {}

  ngOnInit(): void {
    this.cargarServicios();

    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.translateAllServices(event.lang);
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  /**
   * Cargar servicios desde el backend
   */
  cargarServicios(): void {
    this.loading = true;
    this.errorMsg = '';

    this.http
      .get<Servicio[]>(this.baseUrl)
      .pipe(
        catchError((err) => {
          console.error('Error al cargar servicios:', err);
          this.errorMsg =
            'No se pudieron cargar los servicios. Verifica que el backend esté corriendo en https://backend-lumaresort.onrender.com';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.servicios = data;
        this.serviciosFiltrados = [...data];
        this.extraerTiposUnicos();
        this.loading = false;

        // Traducir al idioma actual
        const currentLang = this.translate.currentLang ?? this.translate.getDefaultLang() ?? 'es';
        this.translateAllServices(currentLang);
      });
  }

  /**
   * Traduce todos los servicios al idioma especificado
   */
  private translateAllServices(targetLang: string): void {
    if (targetLang === 'es') {
      this.translatedServices.clear();
      return;
    }

    this.translating = true;

    // Traducir cada servicio (nombre, descripción y tipo)
    const translations$ = this.servicios.map((servicio) => {
      return forkJoin({
        nombre: this.autoTranslate.translate(servicio.nombre, targetLang),
        descripcion: this.autoTranslate.translate(servicio.descripcion, targetLang),
        tipo: this.autoTranslate.translate(servicio.tipo, targetLang),
      });
    });

    // Ejecutar todas las traducciones en paralelo
    forkJoin(translations$).subscribe({
      next: (results) => {
        results.forEach((translation, index) => {
          const servicioId = this.servicios[index].idServicio;
          if (servicioId) {
            this.translatedServices.set(servicioId, translation);
          }
        });
        this.translating = false;
      },
      error: (err) => {
        console.error('Error traduciendo servicios:', err);
        this.translating = false;
      },
    });
  }

  /**
   * Obtiene el nombre traducido del servicio
   */
  getTranslatedName(servicio: Servicio): string {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    if (currentLang === 'es') {
      return servicio.nombre;
    }
    return this.translatedServices.get(servicio.idServicio!)?.nombre || servicio.nombre;
  }

  /**
   * Obtiene el tipo traducido del servicio
   */
  getTranslatedType(servicio: Servicio): string {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    if (currentLang === 'es') {
      return servicio.tipo;
    }
    return this.translatedServices.get(servicio.idServicio!)?.tipo || servicio.tipo;
  }

  /**
   * Obtiene la descripción traducida del servicio
   */
  getTranslatedDescription(servicio: Servicio): string {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    if (currentLang === 'es') {
      return servicio.descripcion;
    }
    return this.translatedServices.get(servicio.idServicio!)?.descripcion || servicio.descripcion;
  }

  /**
   * Obtener descripción corta traducida (primeros 100 caracteres)
   */
  obtenerDescripcionCortaTraducida(servicio: Servicio): string {
    const descripcionCompleta = this.getTranslatedDescription(servicio);

    if (!descripcionCompleta) return '';

    // Eliminar etiquetas HTML
    const textoLimpio = descripcionCompleta.replace(/<[^>]*>/g, '');

    if (textoLimpio.length <= 100) {
      return textoLimpio;
    }

    return textoLimpio.substring(0, 100) + '...';
  }

  /**
   * Extraer tipos únicos para el filtro
   */
  private extraerTiposUnicos(): void {
    const tipos = this.servicios.map((s) => s.tipo).filter((t) => t);
    this.tiposUnicos = [...new Set(tipos)];
  }

  /**
   * Aplicar filtros de búsqueda y tipo
   */
  aplicarFiltros(): void {
    let resultado = [...this.servicios];

    // Filtro por texto (nombre o descripción traducidos)
    if (this.filtroTexto.trim()) {
      const textoLower = this.filtroTexto.toLowerCase().trim();
      resultado = resultado.filter((s) => {
        const nombreTraducido = this.getTranslatedName(s).toLowerCase();
        const descripcionTraducida = this.getTranslatedDescription(s).toLowerCase();
        return nombreTraducido.includes(textoLower) || descripcionTraducida.includes(textoLower);
      });
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      resultado = resultado.filter((s) => s.tipo === this.filtroTipo);
    }

    this.serviciosFiltrados = resultado;

    // Mantener el orden si existe
    if (this.columnaOrden) {
      this.aplicarOrden();
    }
  }

  /**
   * Ordenar por columna
   */
  ordenarPor(columna: 'nombre' | 'tipo' | 'precio'): void {
    if (this.columnaOrden === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.columnaOrden = columna;
      this.ordenAscendente = true;
    }

    this.aplicarOrden();
  }

  /**
   * Aplicar ordenamiento (usa texto traducido para nombre y tipo)
   */
  private aplicarOrden(): void {
    this.serviciosFiltrados.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (this.columnaOrden) {
        case 'nombre':
          valorA = this.getTranslatedName(a).toLowerCase();
          valorB = this.getTranslatedName(b).toLowerCase();
          break;
        case 'tipo':
          valorA = this.getTranslatedType(a).toLowerCase();
          valorB = this.getTranslatedType(b).toLowerCase();
          break;
        case 'precio':
          valorA = a.precio || 0;
          valorB = b.precio || 0;
          break;
        default:
          return 0;
      }

      if (valorA < valorB) {
        return this.ordenAscendente ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.ordenAscendente ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Ver detalle del servicio
   */
  verDetalle(idServicio?: number): void {
    if (idServicio) {
      this.router.navigate(['/servicios', idServicio]);
    }
  }

  /**
   * Reservar servicio
   */
  reservar(idServicio?: number): void {
    if (idServicio) {
      this.router.navigate(['/reservar', idServicio]);
    }
  }

  /**
   * Calcular promedio de calificaciones
   */
  calcularPromedio(servicio: Servicio): number {
    if (!servicio.comentarios || servicio.comentarios.length === 0) {
      return 0;
    }

    const sum = servicio.comentarios.reduce((acc, c) => acc + (c.calificacion ?? 0), 0);
    return Math.round((sum / servicio.comentarios.length) * 10) / 10;
  }

  /**
   * Calcular promedio global de todos los servicios
   */
  calcularPromedioGlobal(): number {
    if (this.servicios.length === 0) return 0;

    const promedios = this.servicios.map((s) => this.calcularPromedio(s));
    const sum = promedios.reduce((acc, p) => acc + p, 0);
    return Math.round((sum / this.servicios.length) * 10) / 10;
  }

  /**
   * Calcular precio promedio
   */
  calcularPrecioPromedio(): number {
    if (this.servicios.length === 0) return 0;

    const sum = this.servicios.reduce((acc, s) => acc + (s.precio ?? 0), 0);
    return sum / this.servicios.length;
  }

  /**
   * Obtener descripción corta (primeros 100 caracteres) - versión sin traducir
   */
  obtenerDescripcionCorta(descripcion?: string): string {
    if (!descripcion) return '';

    const textoLimpio = descripcion.replace(/<[^>]*>/g, '');

    if (textoLimpio.length <= 100) {
      return textoLimpio;
    }

    return textoLimpio.substring(0, 100) + '...';
  }

  /**
   * Manejar error de imagen
   */
  onImageError(event: Event): void {
    const el = event.target as HTMLImageElement;
    el.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%230a1524"/><text x="50%" y="50%" fill="%235aa8ff" font-size="12" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Sin imagen</text></svg>';
  }
}

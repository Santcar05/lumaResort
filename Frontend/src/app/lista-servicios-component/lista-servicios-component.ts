import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../Models/Servicio';

@Component({
  selector: 'app-lista-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-servicios-component.html',
  styleUrls: ['./lista-servicios-component.css'],
})
export class ListaServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  loading = true;
  errorMsg = '';

  // Filtros
  filtroTexto = '';
  filtroTipo = '';
  tiposUnicos: string[] = [];

  // Ordenamiento
  columnaOrden: 'nombre' | 'tipo' | 'precio' | '' = '';
  ordenAscendente = true;

  private baseUrl = 'http://localhost:8080/servicios';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarServicios();
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
            'No se pudieron cargar los servicios. Verifica que el backend esté corriendo en http://localhost:8080';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.servicios = data;
        this.serviciosFiltrados = [...data];
        this.extraerTiposUnicos();
        this.loading = false;
      });
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

    // Filtro por texto (nombre o descripción)
    if (this.filtroTexto.trim()) {
      const textoLower = this.filtroTexto.toLowerCase().trim();
      resultado = resultado.filter(
        (s) =>
          s.nombre?.toLowerCase().includes(textoLower) ||
          s.descripcion?.toLowerCase().includes(textoLower)
      );
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
   * Aplicar ordenamiento
   */
  private aplicarOrden(): void {
    this.serviciosFiltrados.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (this.columnaOrden) {
        case 'nombre':
          valorA = a.nombre?.toLowerCase() || '';
          valorB = b.nombre?.toLowerCase() || '';
          break;
        case 'tipo':
          valorA = a.tipo?.toLowerCase() || '';
          valorB = b.tipo?.toLowerCase() || '';
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
      // Navegar a la página de reserva (ajusta la ruta según tu aplicación)
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
   * Obtener descripción corta (primeros 100 caracteres)
   */
  obtenerDescripcionCorta(descripcion?: string): string {
    if (!descripcion) return '';

    // Eliminar etiquetas HTML
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { Servicio } from '../../Models/Servicio';
import { HttpClient } from '@angular/common/http';
import { ActividadesService } from '../../service/actividades/actividades';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-actividades-component',
  imports: [CommonModule, TranslateModule],
  templateUrl: './actividades-component.html',
  styleUrl: './actividades-component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ActividadesComponent implements OnInit {
  activeCategory: string = '';
  selectedImageIndex: number = 0;
  isLoading: boolean = true;

  categories: {
    id: string;
    nombre: string;
    images: string[];
    imageNames: string[];
    servicios: Servicio[];
  }[] = [];

  constructor(
    private http: HttpClient,
    private servicioService: ActividadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎯 Iniciando carga de actividades...');
    this.isLoading = true;

    this.findAll().subscribe({
      next: (data) => {
        console.log('📦 Actividades recibidas:', data);
        this.buildCategories(data);

        if (this.categories.length > 0) {
          this.activeCategory = this.categories[0].id;
          console.log('✅ Categoría activa inicial:', this.activeCategory);
        } else {
          console.warn('⚠️ No hay categorías disponibles');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar actividades:', error);
        this.isLoading = false;
      },
    });
  }

  findAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>('http://localhost:8080/actividades');
  }

  buildCategories(servicios: Servicio[]): void {
    const grouped: { [tipo: string]: Servicio[] } = {};

    servicios.forEach((servicio) => {
      if (!grouped[servicio.tipo]) {
        grouped[servicio.tipo] = [];
      }
      grouped[servicio.tipo].push(servicio);
    });

    this.categories = Object.keys(grouped).map((tipo) => ({
      id: tipo,
      nombre: tipo,
      images: grouped[tipo].map((s) => s.imagenURL || ''),
      imageNames: grouped[tipo].map((s) => s.nombre || 'Sin nombre'),
      servicios: grouped[tipo],
    }));

    console.log('📂 Categorías construidas:', this.categories.length);
  }

  selectCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.selectedImageIndex = 0;
    console.log('🔄 Categoría seleccionada:', categoryId);
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getCurrentCategory(): {
    id: string;
    nombre: string;
    images: string[];
    imageNames: string[];
    servicios: Servicio[];
  } | null {
    if (this.categories.length === 0) {
      return null;
    }

    const category = this.categories.find((cat) => cat.id === this.activeCategory);
    return category || this.categories[0];
  }

  explorarServicio(): void {
    const categoriaActual = this.getCurrentCategory();

    if (!categoriaActual || !categoriaActual.servicios || categoriaActual.servicios.length === 0) {
      console.warn('⚠️ No hay servicios disponibles');
      return;
    }

    const servicio = categoriaActual.servicios[this.selectedImageIndex];

    if (servicio && servicio.idServicio) {
      console.log('🔗 Navegando al servicio:', servicio.idServicio);
      this.router.navigate(['/servicios', servicio.idServicio]);
    }
  }
}

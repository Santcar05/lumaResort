import { Component } from '@angular/core';
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
export class ActividadesComponent {
  activeCategory: string = '';
  selectedImageIndex: number = 0;

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
    this.findAll().subscribe((data) => {
      this.buildCategories(data);
      if (this.categories.length > 0) {
        this.activeCategory = this.categories[0].id;
      }
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
      images: grouped[tipo].map((s) => s.imagenURL),
      imageNames: grouped[tipo].map((s) => s.nombre),
      servicios: grouped[tipo],
    }));
  }

  selectCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.selectedImageIndex = 0; // reset a primera imagen
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getCurrentCategory(): any {
    return this.categories.find((cat) => cat.id === this.activeCategory) || this.categories[0];
  }

  explorarServicio(): void {
    const categoriaActual = this.getCurrentCategory();
    const servicio = categoriaActual.servicios[this.selectedImageIndex];
    if (servicio) {
      this.router.navigate(['/servicios', servicio.idServicio]);
    }
  }
}

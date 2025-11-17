import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TipoHabitacionService } from '../service/tipo-habitacion';
import { AutoTranslateService } from '../service/translation/auto-translate-service';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { Subscription, forkJoin } from 'rxjs';

interface Room {
  name: string;
  description: string;
  images: string[];
  price: string;
  features: string[];
}

interface TranslatedRoom {
  name: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-carrusel-tipos-habitacion-component',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './carrusel-tipos-habitacion-component.html',
  styleUrls: ['./carrusel-tipos-habitacion-component.css'],
})
export class CarruselTiposHabitacionComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;
  loading = true;
  rooms: Room[] = [];
  translatedRooms: Map<number, TranslatedRoom> = new Map();

  private langChangeSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private tipoHabitacionService: TipoHabitacionService,
    private translate: TranslateService,
    private autoTranslate: AutoTranslateService
  ) {}

  ngOnInit(): void {
    this.loadRooms();

    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.translateAllRooms(event.lang);
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  private loadRooms(): void {
    this.loading = true;

    this.findAll().subscribe({
      next: (data) => {
        this.buildRooms(data);
        this.loading = false;

        // Traducir al idioma actual
        const currentLang = this.translate.currentLang ?? this.translate.getDefaultLang() ?? 'es';
        this.translateAllRooms(currentLang);
      },
      error: (err) => {
        console.error('Error cargando habitaciones:', err);
        this.loading = false;
      },
    });
  }

  findAll() {
    return this.http.get<TipoHabitacion[]>(
      'https://backend-lumaresort.onrender.com/tiposHabitacion'
    );
  }

  buildRooms(tiposHabitacion: any[]): void {
    this.rooms = tiposHabitacion.map((tipo) => ({
      name: tipo.nombre,
      description: tipo.descripcion,
      images:
        tipo.imagenesURL && tipo.imagenesURL.length > 0
          ? tipo.imagenesURL
          : ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'],
      price: tipo.precio ? `$${tipo.precio}` : 'N/A',
      features: Array.isArray(tipo.caracteristicas)
        ? tipo.caracteristicas.flatMap((c: string) => c.split(',').map((f) => f.trim()))
        : typeof tipo.caracteristicas === 'string'
        ? tipo.caracteristicas.split(',').map((f: string) => f.trim())
        : [],
    }));
  }

  /**
   * Traduce todas las habitaciones al idioma especificado
   */
  private translateAllRooms(targetLang: string): void {
    if (targetLang === 'es') {
      // Si es español, limpiar traducciones
      this.translatedRooms.clear();
      return;
    }

    // Traducir cada habitación
    this.rooms.forEach((room, index) => {
      this.translateRoom(room, index, targetLang);
    });
  }

  /**
   * Traduce una habitación individual (nombre, descripción y características)
   */
  private translateRoom(room: Room, index: number, targetLang: string): void {
    // Preparar traducciones en paralelo
    const translations$ = {
      name: this.autoTranslate.translate(room.name, targetLang),
      description: this.autoTranslate.translate(room.description, targetLang),
      // Traducir cada característica
      features: forkJoin(
        room.features.map((feature) => this.autoTranslate.translate(feature, targetLang))
      ),
    };

    // Ejecutar todas las traducciones en paralelo
    forkJoin(translations$).subscribe({
      next: (translations) => {
        this.translatedRooms.set(index, {
          name: translations.name,
          description: translations.description,
          features: translations.features,
        });
      },
      error: (err) => {
        console.error(`Error traduciendo habitación ${index}:`, err);
      },
    });
  }

  /**
   * Obtiene el nombre traducido de la habitación
   */
  getTranslatedName(index: number): string {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    if (currentLang === 'es') {
      return this.rooms[index].name;
    }
    return this.translatedRooms.get(index)?.name || this.rooms[index].name;
  }

  /**
   * Obtiene la descripción traducida de la habitación
   */
  getTranslatedDescription(index: number): string {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    if (currentLang === 'es') {
      return this.rooms[index].description;
    }
    return this.translatedRooms.get(index)?.description || this.rooms[index].description;
  }

  /**
   * Obtiene las características traducidas de la habitación
   */
  getTranslatedFeatures(index: number): string[] {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    if (currentLang === 'es') {
      return this.rooms[index].features;
    }
    return this.translatedRooms.get(index)?.features || this.rooms[index].features;
  }

  // Métodos de navegación del carrusel
  nextRoom(): void {
    this.currentIndex = (this.currentIndex + 1) % this.rooms.length;
  }

  prevRoom(): void {
    this.currentIndex = (this.currentIndex - 1 + this.rooms.length) % this.rooms.length;
  }

  goToRoom(index: number): void {
    this.currentIndex = index;
  }
}

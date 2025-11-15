import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TipoHabitacionService } from '../service/tipo-habitacion';
import { TipoHabitacion } from '../Models/TipoHabitacion';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-carrusel-tipos-habitacion-component',
  imports: [CommonModule, TranslateModule],
  templateUrl: './carrusel-tipos-habitacion-component.html',
  styleUrl: './carrusel-tipos-habitacion-component.css',
})
export class CarruselTiposHabitacionComponent {
  currentIndex: number = 0;

  rooms: {
    name: string;
    description: string;
    images: string[];
    price: string;
    features: string[];
  }[] = [];

  constructor(private http: HttpClient, private tipoHabitacionService: TipoHabitacionService) {}

  ngOnInit(): void {
    this.findAll().subscribe((data) => {
      this.buildRooms(data);
      console.log(this.rooms);
    });
  }

  findAll() {
    return this.http.get<TipoHabitacion[]>('http://localhost:8080/tiposHabitacion');
  }
  buildRooms(tiposHabitacion: any[]): void {
    this.rooms = tiposHabitacion.map((tipo) => ({
      name: tipo.nombre,
      description: tipo.descripcion,
      images: tipo.imagenesURL
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

  /*
  rooms = [
    {
      name: 'Habitación Deluxe',
      description:
        'Amplia habitación con vista al mar, cama king size y todas las comodidades para una estancia perfecta.',
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      price: '$199',
      features: ['Vista al mar', 'Wi-Fi gratis', 'Minibar', 'TV pantalla plana'],
    },
    {
      name: 'Suite Ejecutiva',
      description:
        'Lujosa suite con sala de estar separada, baño de mármol y acceso exclusivo al lounge ejecutivo.',
      image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
      price: '$299',
      features: ['Sala de estar', 'Baño de mármol', 'Lounge ejecutivo', 'Desayuno incluido'],
    },
    {
      name: 'Habitación Familiar',
      description:
        'Espaciosa habitación perfecta para familias, con dos camas dobles y área de juegos para niños.',
      image: 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg',
      price: '$249',
      features: ['2 camas dobles', 'Área infantil', 'Microondas', 'Refrigerador'],
    },
    {
      name: 'Suite Presidencial',
      description:
        'La experiencia definitiva de lujo con terraza privada, jacuzzi y servicio de mayordomo las 24 horas.',
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      price: '$499',
      features: ['Terraza privada', 'Jacuzzi', 'Servicio de mayordomo', 'Cena gourmet'],
    },
    {
      name: 'Habitación Standard',
      description:
        'Cómoda y acogedora habitación con todas las amenities esenciales para una estancia placentera.',
      image: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
      price: '$149',
      features: ['Cama queen', 'Baño moderno', 'TV por cable', 'Aire acondicionado'],
    },
  ];
  */

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

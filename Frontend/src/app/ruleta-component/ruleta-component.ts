import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OfertaFlash } from '../Models/OfertaFlash';

interface Premio {
  oferta: OfertaFlash;
  mostrar: string; // Texto corto para mostrar en la ruleta
}

@Component({
  selector: 'app-ruleta-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ruleta-component.html',
  styleUrls: ['./ruleta-component.css'],
})
export class RuletaComponent implements OnInit {
  @ViewChild('ruletaCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() premioSeleccionado = new EventEmitter<OfertaFlash>();
  @Output() cerrar = new EventEmitter<void>();
  @Input() idReserva?: number;

  mostrarRuleta = false;
  mostrarResultado = false;
  premioGanado: OfertaFlash | null = null;
  girando = false;
  cargandoOfertas = true;

  private ctx!: CanvasRenderingContext2D;
  private anguloActual = 0;
  private velocidadAngular = 0;
  private animationId: any;

  premios: Premio[] = [];

  private baseUrl = 'http://localhost:8080/ofertas-flash';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.cargandoOfertas = true;

    // Cargar ofertas activas desde el backend
    this.http.get<OfertaFlash[]>(`${this.baseUrl}/activas`).subscribe({
      next: (ofertas) => {
        if (ofertas.length === 0) {
          // Si no hay ofertas, usar valores por defecto
          this.usarOfertasPorDefecto();
        } else {
          this.premios = ofertas.map((oferta) => ({
            oferta,
            mostrar: this.obtenerTextoCorto(oferta),
          }));
        }

        this.cargandoOfertas = false;
        this.iniciarRuleta();
      },
      error: () => {
        // En caso de error, usar ofertas por defecto
        this.usarOfertasPorDefecto();
        this.cargandoOfertas = false;
        this.iniciarRuleta();
      },
    });
  }

  usarOfertasPorDefecto(): void {
    const ofertasDefault: OfertaFlash[] = [
      {
        id: 0,
        titulo: '10% de Descuento',
        descripcion: 'Descuento del 10% en tu habitación',
        tipoOferta: 'DESCUENTO_HABITACION',
        porcentajeDescuento: 10,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#4a90e2',
        icono: '🎉',
      },
      {
        id: 0,
        titulo: 'Cóctel Gratis',
        descripcion: 'Cóctel de bienvenida gratuito',
        tipoOferta: 'SERVICIO_GRATIS',
        porcentajeDescuento: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#5aa8ff',
        icono: '🍹',
      },
      {
        id: 0,
        titulo: '15% de Descuento',
        descripcion: 'Descuento del 15% en tu habitación',
        tipoOferta: 'DESCUENTO_HABITACION',
        porcentajeDescuento: 15,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#3d7ec4',
        icono: '🌟',
      },
      {
        id: 0,
        titulo: 'Desayuno Gratis',
        descripcion: 'Desayuno gratuito durante tu estadía',
        tipoOferta: 'SERVICIO_GRATIS',
        porcentajeDescuento: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#6bb5ff',
        icono: '🍰',
      },
      {
        id: 0,
        titulo: '20% de Descuento',
        descripcion: 'Descuento del 20% en tu habitación',
        tipoOferta: 'DESCUENTO_HABITACION',
        porcentajeDescuento: 20,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#2e6ba8',
        icono: '💎',
      },
      {
        id: 0,
        titulo: 'Spa VIP',
        descripcion: 'Acceso VIP al spa',
        tipoOferta: 'SERVICIO_GRATIS',
        porcentajeDescuento: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#7ac3ff',
        icono: '🏊',
      },
      {
        id: 0,
        titulo: 'Upgrade Gratis',
        descripcion: 'Mejora de habitación sin costo',
        tipoOferta: 'UPGRADE',
        porcentajeDescuento: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#1e5a96',
        icono: '🎁',
      },
      {
        id: 0,
        titulo: 'Late Check-out',
        descripcion: 'Salida tardía sin cargo adicional',
        tipoOferta: 'SERVICIO_GRATIS',
        porcentajeDescuento: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        activa: true,
        color: '#89d0ff',
        icono: '🌺',
      },
    ];

    this.premios = ofertasDefault.map((oferta) => ({
      oferta,
      mostrar: this.obtenerTextoCorto(oferta),
    }));
  }

  obtenerTextoCorto(oferta: OfertaFlash): string {
    if (
      oferta.tipoOferta === 'DESCUENTO_HABITACION' ||
      oferta.tipoOferta === 'DESCUENTO_SERVICIOS'
    ) {
      return `${oferta.porcentajeDescuento}% OFF`;
    }
    return oferta.titulo.length > 20 ? oferta.titulo.substring(0, 17) + '...' : oferta.titulo;
  }

  iniciarRuleta(): void {
    setTimeout(() => {
      this.mostrarRuleta = true;
      setTimeout(() => this.inicializarCanvas(), 100);
    }, 500);
  }

  inicializarCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    // Tamaño responsivo más pequeño
    const maxSize = Math.min(window.innerWidth * 0.5, 400); // Reducido de 0.8 a 0.5 y de 500 a 400
    canvas.width = maxSize;
    canvas.height = maxSize;

    this.ctx = canvas.getContext('2d')!;
    this.dibujarRuleta();

    // Girar automáticamente después de 1 segundo
    setTimeout(() => this.girarRuleta(), 1000);
  }

  dibujarRuleta(): void {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.anguloActual);

    const segmentAngle = (2 * Math.PI) / this.premios.length;

    // Dibujar segmentos
    this.premios.forEach((premio, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Segmento
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, startAngle, endAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = premio.oferta.color;
      this.ctx.fill();

      // Borde
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Texto e icono
      this.ctx.save();
      const angle = startAngle + segmentAngle / 2;
      this.ctx.rotate(angle);
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffff';

      // Icono (más pequeño)
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillText(premio.oferta.icono, radius * 0.65, -5);

      // Texto (más pequeño y ajustado)
      this.ctx.font = 'bold 11px Arial';
      const palabras = premio.mostrar.split(' ');
      if (palabras.length > 1) {
        this.ctx.fillText(palabras[0], radius * 0.65, 15);
        this.ctx.fillText(palabras.slice(1).join(' '), radius * 0.65, 28);
      } else {
        this.ctx.fillText(premio.mostrar, radius * 0.65, 15);
      }

      this.ctx.restore();
    });

    // Centro decorativo
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'rgba(10, 26, 47, 0.95)';
    this.ctx.fill();
    this.ctx.strokeStyle = '#5aa8ff';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.restore();
  }

  girarRuleta(): void {
    if (this.girando) return;

    this.girando = true;
    this.mostrarResultado = false;

    // Determinar premio ganador (aleatorio)
    const indiceGanador = Math.floor(Math.random() * this.premios.length);
    const anguloGanador = (indiceGanador * (2 * Math.PI)) / this.premios.length;

    // Calcular ángulo final (varias vueltas + ángulo del premio)
    const vueltasExtra = 5 + Math.floor(Math.random() * 3);
    const anguloFinal = vueltasExtra * 2 * Math.PI + anguloGanador;

    this.animarGiro(anguloFinal);
  }

  animarGiro(anguloFinal: number): void {
    const duracion = 5000;
    const inicio = Date.now();
    const anguloInicial = this.anguloActual;

    const animar = () => {
      const tiempoTranscurrido = Date.now() - inicio;
      const progreso = Math.min(tiempoTranscurrido / duracion, 1);

      const ease = 1 - Math.pow(1 - progreso, 3);

      this.anguloActual = anguloInicial + (anguloFinal - anguloInicial) * ease;
      this.dibujarRuleta();

      if (progreso < 1) {
        this.animationId = requestAnimationFrame(animar);
      } else {
        this.detenerRuleta();
      }
    };

    animar();
  }

  detenerRuleta(): void {
    this.girando = false;

    const anguloNormalizado = ((this.anguloActual % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const segmentAngle = (2 * Math.PI) / this.premios.length;

    const anguloIndicador = Math.PI / 2;
    const anguloRelativo = (anguloIndicador - anguloNormalizado + 2 * Math.PI) % (2 * Math.PI);

    const indiceGanador = Math.floor(anguloRelativo / segmentAngle);
    this.premioGanado = this.premios[indiceGanador].oferta;

    // Guardar premio en el backend
    if (this.idReserva && this.premioGanado.id > 0) {
      this.aplicarPremio();
    }

    setTimeout(() => {
      this.mostrarResultado = true;
    }, 500);
  }

  aplicarPremio(): void {
    if (!this.idReserva || !this.premioGanado) return;

    const url = `http://localhost:8080/reservas/${this.idReserva}/aplicar-oferta/${this.premioGanado.id}`;

    this.http.patch(url, {}).subscribe({
      next: () => console.log('✅ Premio aplicado correctamente'),
      error: (err) => console.error('❌ Error al aplicar premio:', err),
    });
  }

  cerrarRuleta(): void {
    if (this.premioGanado) {
      this.premioSeleccionado.emit(this.premioGanado);
    }
    this.mostrarRuleta = false;
    this.cerrar.emit();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.mostrarResultado) {
      this.cerrarRuleta();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.mostrarResultado && event.target === event.currentTarget) {
      this.cerrarRuleta();
    }
  }
}

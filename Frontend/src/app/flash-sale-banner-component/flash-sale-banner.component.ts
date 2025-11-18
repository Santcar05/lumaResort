import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { OfertaFlashService } from '../service/oferta-flash.service';
import { OfertaFlash } from '../Models/OfertaFlash';

@Component({
  selector: 'app-flash-sale-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flash-sale-banner.component.html',
  styleUrls: ['./flash-sale-banner.component.css'],
})
export class FlashSaleBannerComponent implements OnInit, OnDestroy {
  ofertaActual: OfertaFlash | null = null;
  mostrarBanner = false;
  tiempoRestante = '';

  private ofertasSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(private ofertaFlashService: OfertaFlashService, private router: Router) {}

  ngOnInit(): void {
    // Delay de 2 segundos para no bloquear la carga inicial de la landing page
    setTimeout(() => {
      console.log('🚀 Iniciando carga de ofertas flash...');

      // Iniciar el polling de ofertas cuando el componente se carga
      this.ofertaFlashService.iniciarPolling();

      // Suscribirse a las ofertas activas
      this.ofertasSubscription = this.ofertaFlashService.ofertasActivas$.subscribe(
        (ofertas) => {
          console.log('📦 Ofertas recibidas:', ofertas);

          if (ofertas && ofertas.length > 0) {
            // Mostrar la primera oferta activa
            this.ofertaActual = ofertas[0];
            this.mostrarBanner = true;
            this.iniciarTemporizador();
            console.log('✅ Banner de oferta flash activado');
          } else {
            this.mostrarBanner = false;
            this.ofertaActual = null;
            console.log('ℹ️ No hay ofertas activas disponibles');
          }
        },
        (error) => {
          console.error('❌ Error al suscribirse a ofertas:', error);
          this.mostrarBanner = false;
        }
      );
    }, 2000); // Aumentado a 2 segundos
  }

  ngOnDestroy(): void {
    console.log('🧹 Limpiando suscripciones del banner de ofertas');

    if (this.ofertasSubscription) {
      this.ofertasSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  iniciarTemporizador(): void {
    // Detener temporizador anterior si existe
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // Actualizar cada segundo
    this.timerSubscription = interval(1000).subscribe(() => {
      this.actualizarTiempoRestante();
    });

    // Actualizar inmediatamente
    this.actualizarTiempoRestante();
  }

  // REEMPLAZAR EL MÉTODO actualizarTiempoRestante() COMPLETO:

  actualizarTiempoRestante(): void {
    if (!this.ofertaActual) return;

    const ahora = new Date().getTime();
    const fechaFin = new Date(this.ofertaActual.fechaFin).getTime();
    const diferencia = fechaFin - ahora;

    if (diferencia <= 0) {
      // Oferta expirada - ocultar banner y detener temporizador
      this.tiempoRestante = 'Oferta expirada';
      this.mostrarBanner = false;
      this.ofertaActual = null;

      // Detener el temporizador para evitar bucles
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }

      // NO recargar automáticamente - el polling lo hará cada 5 minutos
      return;
    }

    // Calcular horas, minutos y segundos
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    this.tiempoRestante = `${this.pad(horas)}:${this.pad(minutos)}:${this.pad(segundos)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  cerrarBanner(): void {
    console.log('❌ Banner cerrado por el usuario');
    this.mostrarBanner = false;
  }

  irAReservas(): void {
    console.log('🔗 Navegando a reservas desde banner de ofertas');
    this.router.navigate(['/reservas']);
  }
}

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
  styleUrls: ['./flash-sale-banner.component.css']
})
export class FlashSaleBannerComponent implements OnInit, OnDestroy {
  ofertaActual: OfertaFlash | null = null;
  mostrarBanner = false;
  tiempoRestante = '';

  private ofertasSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(
    private ofertaFlashService: OfertaFlashService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Delay de 1 segundo para no bloquear la carga inicial de la landing page
    setTimeout(() => {
      // Iniciar el polling de ofertas cuando el componente se carga
      this.ofertaFlashService.iniciarPolling();

      // Suscribirse a las ofertas activas
      this.ofertasSubscription = this.ofertaFlashService.ofertasActivas$.subscribe(ofertas => {
        if (ofertas && ofertas.length > 0) {
          // Mostrar la primera oferta activa
          this.ofertaActual = ofertas[0];
          this.mostrarBanner = true;
          this.iniciarTemporizador();
        } else {
          this.mostrarBanner = false;
          this.ofertaActual = null;
        }
      });
    }, 1000);
  }

  ngOnDestroy(): void {
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

  actualizarTiempoRestante(): void {
    if (!this.ofertaActual) return;

    const ahora = new Date().getTime();
    const fechaFin = new Date(this.ofertaActual.fechaFin).getTime();
    const diferencia = fechaFin - ahora;

    if (diferencia <= 0) {
      this.tiempoRestante = 'Oferta expirada';
      this.mostrarBanner = false;
      // Recargar ofertas para obtener la siguiente
      this.ofertaFlashService.recargarOfertas();
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
    this.mostrarBanner = false;
  }

  irAReservas(): void {
    this.router.navigate(['/reservas']);
  }
}

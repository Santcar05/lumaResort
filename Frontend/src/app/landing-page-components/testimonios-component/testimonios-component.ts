import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-testimonios-component',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './testimonios-component.html',
  styleUrl: './testimonios-component.css',
})
export class TestimoniosComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;
  autoPlayInterval: any;
  visibleCards: number = 3;
  totalTestimonials: number = 0;
  isBrowser: boolean = false;

  testimonials = [
    {
      text: 'Mi estancia en LumaResort fue simplemente increíble. El servicio excepcional, las instalaciones de primera categoría y las vistas al mar hicieron de mis vacaciones una experiencia inolvidable. ¡Definitivamente volveré!',
      name: 'María González',
      title: 'Huésped Premium',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    },
    {
      text: 'La suite presidencial superó todas mis expectativas. Cada detalle estaba cuidadosamente pensado, desde la decoración hasta el servicio de mayordomo. Una experiencia verdaderamente de lujo.',
      name: 'Carlos Rodríguez',
      title: 'Ejecutivo Corporativo',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
    {
      text: 'Perfecto para familias! Nuestros hijos disfrutaron de las actividades infantiles mientras nosotros relajábamos en el spa. El personal fue extremadamente amable y atento con nosotros.',
      name: 'Ana Martínez',
      title: 'Madre de Familia',
      avatar: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg',
    },
    {
      text: 'Como food blogger, debo decir que la experiencia gastronómica fue extraordinaria. Los chefs crean platillos innovadores con ingredientes locales de la más alta calidad.',
      name: 'Javier López',
      title: 'Crítico Gastronómico',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    {
      text: 'Ideal para luna de miel. La privacidad, el romanticismo y los detalles especiales hicieron de nuestra estancia algo mágico. Las cenas en la playa fueron nuestro momento favorito.',
      name: 'Laura y Miguel',
      title: 'Recién Casados',
      avatar: 'https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg',
    },
    {
      text: 'El wellness center es simplemente espectacular. Los tratamientos de spa, las clases de yoga al amanecer y el equipo de profesionales hicieron que me sintiera renovado por completo.',
      name: 'Sofía Ramírez',
      title: 'Influencer de Wellness',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.totalTestimonials = this.testimonials.length;

    if (this.isBrowser) {
      this.calculateVisibleCards();
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.calculateVisibleCards();
    }
  }

  calculateVisibleCards() {
    if (!this.isBrowser) return;

    if (window.innerWidth < 768) {
      this.visibleCards = 1;
    } else if (window.innerWidth < 1024) {
      this.visibleCards = 2;
    } else {
      this.visibleCards = 3;
    }
  }

  startAutoPlay(): void {
    if (!this.isBrowser) return;

    this.autoPlayInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextTestimonial(): void {
    if (this.currentIndex + this.visibleCards < this.totalTestimonials) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volver al inicio
    }
  }

  prevTestimonial(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = Math.max(0, this.totalTestimonials - this.visibleCards);
    }
  }

  goToTestimonial(index: number): void {
    if (index <= this.totalTestimonials - this.visibleCards) {
      this.currentIndex = index;
    } else {
      this.currentIndex = Math.max(0, this.totalTestimonials - this.visibleCards);
    }
  }

  selectTestimonial(index: number): void {
    if (index >= this.currentIndex && index < this.currentIndex + this.visibleCards) {
      return;
    }

    let newIndex = index - Math.floor(this.visibleCards / 2);
    newIndex = Math.max(0, Math.min(newIndex, this.totalTestimonials - this.visibleCards));

    this.currentIndex = newIndex;
  }

  getVisibleTestimonials() {
    return this.testimonials.slice(this.currentIndex, this.currentIndex + this.visibleCards);
  }

  getTransformValue(): string {
    const cardWidth = 100 / this.visibleCards;
    return `translateX(-${this.currentIndex * cardWidth}%)`;
  }

  isTestimonialVisible(index: number): boolean {
    return index >= this.currentIndex && index < this.currentIndex + this.visibleCards;
  }

  getTestimonialPosition(index: number): number {
    return index - this.currentIndex;
  }
}

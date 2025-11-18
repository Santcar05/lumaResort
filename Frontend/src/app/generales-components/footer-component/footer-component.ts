import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-component',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  socialLinks = [
    {
      icon: 'facebook',
      url: '#',
      label: 'Facebook',
      path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    },
    {
      icon: 'twitter',
      url: '#',
      label: 'Twitter',
      path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
    },
    {
      icon: 'instagram',
      url: 'https://www.instagram.com/hotellumaresort?igsh=em5jdWM4N3Zidm4z',
      label: 'Instagram',
      path: 'M16 2a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h8zm0 2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-4 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
    },
    {
      icon: 'linkedin',
      url: '#',
      label: 'LinkedIn',
      path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
    },
    {
      icon: 'youtube',
      url: 'https://www.youtube.com/@HotelLumaResort',
      label: 'YouTube',
      path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.25V8.75L15 12l-5.25 3.25z',
    },
  ];

  footerLinks = {
    discover: [
      { name: 'Nuestras Habitaciones', url: '#' },
      { name: 'Servicios de Spa', url: '#' },
      { name: 'Restaurantes', url: '#' },
      { name: 'Eventos', url: '#' },
      { name: 'Galería', url: '#' },
    ],
    services: [
      { name: 'Reservas', url: '#' },
      { name: 'Transporte', url: '#' },
      { name: 'Luna de Miel', url: '#' },
      { name: 'Reuniones', url: '#' },
      { name: 'Wellness', url: '#' },
    ],
    support: [
      { name: 'Centro de Ayuda', url: '#' },
      { name: 'Políticas', url: '#' },
      { name: 'Términos y Condiciones', url: '#' },
      { name: 'Privacidad', url: '#' },
      { name: 'Contacto', url: '#' },
    ],
  };

  newsletterEmail: string = '';
  isSubscribed: boolean = false;
  isLoading: boolean = false;

  // ====== MODAL LEGAL ======
  activeLegalModal: 'privacy' | 'terms' | 'cookies' | null = null;

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | null = null;

  ngOnInit() {
    this.startAnimations();
  }

  startAnimations() {
    // Animaciones manejadas por CSS
  }

  // ================= NEWSLETTER =================
  subscribeNewsletter() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        this.isSubscribed = true;
        this.newsletterEmail = '';

        setTimeout(() => {
          this.isSubscribed = false;
        }, 5000);
      }, 2000);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // ================= MODAL LEGAL =================
  openLegalModal(type: 'privacy' | 'terms' | 'cookies') {
    this.activeLegalModal = type;
  }

  closeLegalModal() {
    this.activeLegalModal = null;
  }

  acceptLegal() {
    this.closeLegalModal();
    this.showToast('Gracias por aceptar, continúe su visita por nuestra página.', 'success');
  }

  rejectLegal() {
    const typeMap = {
      privacy: 'la Política de Privacidad',
      terms: 'los Términos de Uso',
      cookies: 'la Política de Cookies',
    };

    const text = `Dado que no aceptó ${
      typeMap[this.activeLegalModal!]
    }, se recomienda no continuar la visita en la página.`;

    this.closeLegalModal();
    this.showToast(text, 'error');
  }

  // ================= TOAST =================
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = null;
      this.toastType = null;
    }, 4500);
  }

  // ================= TEXTOS PARA EL MODAL =================
  getModalTitle() {
    if (this.activeLegalModal === 'privacy') return 'Política de Privacidad';
    if (this.activeLegalModal === 'terms') return 'Términos de Uso';
    return 'Política de Cookies';
  }

  getModalContent() {
    if (this.activeLegalModal === 'privacy')
      return `En LumaResort, la protección de sus datos personales es prioridad. 
      La información proporcionada será utilizada exclusivamente para la prestación 
      de servicios turísticos, optimización de la experiencia del usuario y cumplimiento 
      de obligaciones legales. No compartimos datos con terceros sin autorización previa.`;

    if (this.activeLegalModal === 'terms')
      return `El uso de este sitio web implica la aceptación de las condiciones de uso, 
      responsabilidades del usuario, políticas de reserva, limitaciones de responsabilidad 
      y normativas de comportamiento digital establecidas por LumaResort. 
      Nos reservamos el derecho de modificar dichas condiciones en cualquier momento.`;

    return `Este sitio utiliza cookies para optimizar la experiencia del usuario, mejorar 
    tiempos de carga, personalizar contenido y analizar patrones de navegación. Usted puede 
    aceptar o rechazar el uso de cookies, aunque al rechazarlas algunas funciones del sitio 
    podrían no estar disponibles.`;
  }
}

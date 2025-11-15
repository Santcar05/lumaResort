import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-contacto-form-component',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contacto-form-component.html',
  styleUrl: './contacto-form-component.css',
})
export class ContactoFormComponent {
  interests = [
    { value: 'reservation', label: 'Reserva de Habitación' },
    { value: 'events', label: 'Organización de Eventos' },
    { value: 'spa', label: 'Servicios de Spa' },
    { value: 'dining', label: 'Reserva en Restaurante' },
    { value: 'meeting', label: 'Sala de Reuniones' },
    { value: 'general', label: 'Información General' },
  ];
  activeView: 'form' | 'map' | 'schedule' = 'form'; // Vista inicial

  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interest: 'general',
  };

  submitted = false;
  isLoading = false;

  setActiveView(view: 'form' | 'map' | 'schedule') {
    this.activeView = view;
  }

  onSubmit() {
    this.isLoading = true;
    setTimeout(() => {
      this.submitted = true;
      this.isLoading = false;
      setTimeout(() => {
        this.submitted = false;
        this.contactForm = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          interest: 'general',
        };
      }, 5000);
    }, 2000);
  }

  getButtonText(): string {
    if (this.isLoading) return 'Enviando...';
    if (this.submitted) return '¡Mensaje Enviado!';
    return 'Enviar Mensaje';
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.contactForm.email);
  }

  isFormValid(): boolean {
    return (
      this.contactForm.name.length > 0 &&
      this.contactForm.email.length > 0 &&
      this.isValidEmail() &&
      this.contactForm.message.length > 0
    );
  }

  selectedDate: Date | null = null;

  // Fechas disponibles (ejemplo)
  availableDates: string[] = ['2025-09-25', '2025-09-27', '2025-09-29', '2025-10-01'];

  // Permite seleccionar solo fechas disponibles
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const isoDate = date.toISOString().split('T')[0];
    return this.availableDates.includes(isoDate);
  };

  // Verificar si es fin de semana
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }
}

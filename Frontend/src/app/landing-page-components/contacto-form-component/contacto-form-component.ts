import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto-form-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto-form-component.html',
  styleUrl: './contacto-form-component.css',
})
export class ContactoFormComponent {
  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interest: 'general',
  };

  interests = [
    { value: 'reservation', label: 'Reserva de Habitación' },
    { value: 'events', label: 'Organización de Eventos' },
    { value: 'spa', label: 'Servicios de Spa' },
    { value: 'dining', label: 'Reserva en Restaurante' },
    { value: 'meeting', label: 'Sala de Reuniones' },
    { value: 'general', label: 'Información General' },
  ];

  submitted = false;
  isLoading = false;

  onSubmit() {
    this.isLoading = true;

    // Simular envío del formulario
    setTimeout(() => {
      this.submitted = true;
      this.isLoading = false;

      // Resetear formulario después de 5 segundos
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

  // Animación para el botón de enviar
  getButtonText(): string {
    if (this.isLoading) return 'Enviando...';
    if (this.submitted) return '¡Mensaje Enviado!';
    return 'Enviar Mensaje';
  }

  // Validación básica de email
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.contactForm.email);
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return (
      this.contactForm.name.length > 0 &&
      this.contactForm.email.length > 0 &&
      this.isValidEmail() &&
      this.contactForm.message.length > 0
    );
  }
}

import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  // IMPORTANTE: Reemplaza con tu clave pública de Stripe
  private readonly STRIPE_PUBLIC_KEY = '';

  constructor() {
    this.stripePromise = loadStripe(this.STRIPE_PUBLIC_KEY);
  }

  async initializeStripe(): Promise<void> {
    if (!this.stripe) {
      this.stripe = await this.stripePromise;
      console.log('✅ Stripe instance creada');
    }
  }

  createElements(): StripeElements | null {
    if (!this.stripe) {
      console.error('❌ No se puede crear elements: Stripe no está inicializado');
      return null;
    }

    // Si ya existen elementos, destruirlos primero
    if (this.elements) {
      this.destroyCardElement();
      this.elements = null;
    }

    this.elements = this.stripe.elements();
    console.log('✅ Stripe Elements creados');
    return this.elements;
  }

  createCardElement(elementId: string): void {
    if (!this.elements) {
      console.error('❌ No se puede crear card element: Elements no está inicializado');
      return;
    }

    // Destruir el elemento anterior si existe
    if (this.cardElement) {
      this.cardElement.unmount();
      this.cardElement.destroy();
      this.cardElement = null;
    }

    const style = {
      base: {
        color: '#003366',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#e63946',
        iconColor: '#e63946',
      },
    };

    try {
      this.cardElement = this.elements.create('card', { style });
      this.cardElement.mount(`#${elementId}`);
      console.log('✅ Card Element montado');
    } catch (error) {
      console.error('❌ Error al crear/montar card element:', error);
      throw error;
    }
  }

  getCardElement(): StripeCardElement | null {
    return this.cardElement;
  }

  isInitialized(): boolean {
    return this.stripe !== null;
  }

  hasCardElement(): boolean {
    return this.cardElement !== null;
  }

  async confirmCardPayment(
    clientSecret: string,
    cardholderName?: string,
    email?: string,
    billingAddress?: any
  ): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe no está inicializado');
    }

    if (!this.cardElement) {
      throw new Error('El elemento de tarjeta no está montado');
    }

    console.log('🔐 Confirmando pago con Stripe...');

    try {
      const billingDetails: any = {};

      if (cardholderName) {
        billingDetails.name = cardholderName;
      }

      if (email) {
        billingDetails.email = email;
      }

      if (billingAddress) {
        billingDetails.address = {
          line1: billingAddress.street,
          city: billingAddress.city,
          state: billingAddress.state,
          postal_code: billingAddress.zipCode,
          country: billingAddress.country,
        };
      }

      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: billingDetails,
        },
      });

      console.log('✅ Respuesta de Stripe:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en confirmCardPayment:', error);
      throw error;
    }
  }

  async createPaymentMethod(
    cardholderName: string,
    email: string,
    billingAddress?: any
  ): Promise<any> {
    if (!this.stripe || !this.cardElement) {
      throw new Error('Stripe no está inicializado');
    }

    return await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: cardholderName,
        email: email,
        address: billingAddress,
      },
    });
  }

  destroyCardElement(): void {
    if (this.cardElement) {
      try {
        this.cardElement.unmount();
        this.cardElement.destroy();
        console.log('🗑️ Card Element destruido');
      } catch (error) {
        console.warn('⚠️ Error al destruir card element:', error);
      }
      this.cardElement = null;
    }
  }

  // Método para limpiar completamente Stripe (útil cuando el componente se destruye)
  cleanup(): void {
    console.log('🧹 Limpiando Stripe Service...');
    this.destroyCardElement();
    // No eliminamos stripe ni stripePromise porque son singleton
    // Solo limpiamos los elementos
    this.elements = null;
  }
}

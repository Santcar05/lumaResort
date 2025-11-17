export interface Payment {
  idPago?: number;
  monto: number;
  metodoPago: 'EFECTIVO' | 'TARJETA';
  estado: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO' | 'CANCELADO';
  fecha?: Date;
  reservaId?: number;
  stripePaymentIntentId?: string;
  descripcion?: string;
}

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  email: string;
  billingAddress?: BillingAddress;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  payment?: Payment;
  error?: string;
}

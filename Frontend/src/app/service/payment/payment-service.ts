import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentIntent, PaymentResponse } from '../../Models/Payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) {}

  // Crear Payment Intent en Stripe
  createPaymentIntent(amount: number, reservaId: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.apiUrl}/create-payment-intent`, {
      amount,
      reservaId,
    });
  }

  // Procesar pago con tarjeta
  processCardPayment(
    paymentIntentId: string,
    reservaId: number,
    amount: number
  ): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/process-card`, {
      paymentIntentId,
      reservaId,
      amount,
    });
  }

  // Procesar pago en efectivo
  processCashPayment(reservaId: number, amount: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/process-cash`, {
      reservaId,
      amount,
      metodoPago: 'EFECTIVO',
    });
  }

  // Confirmar pago
  confirmPayment(paymentIntentId: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/confirm`, { paymentIntentId });
  }

  // Obtener todos los pagos
  findAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  // Obtener pago por ID
  findById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  // Obtener pagos por reserva
  findByReserva(reservaId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/reserva/${reservaId}`);
  }

  // Cancelar pago
  cancelPayment(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}

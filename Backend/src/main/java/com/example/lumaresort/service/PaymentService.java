package com.example.lumaresort.service;

import com.example.lumaresort.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import com.example.lumaresort.entities.Payment;
import com.example.lumaresort.entities.Reserva;
import com.example.lumaresort.repository.ReservaRepository;

@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private final PaymentRepository paymentRepository;
    private final ReservaRepository reservaRepository;

    public PaymentService(PaymentRepository paymentRepository,
            ReservaRepository reservaRepository) {
        this.paymentRepository = paymentRepository;
        this.reservaRepository = reservaRepository;
    }

    @Transactional
    public PaymentIntent createPaymentIntent(BigDecimal amount, Long reservaId)
            throws StripeException {
        Stripe.apiKey = stripeApiKey;

        // Convertir a centavos
        Long amountInCents = amount.multiply(new BigDecimal(100)).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("cop")
                .addPaymentMethodType("card")
                .putMetadata("reservaId", reservaId.toString())
                .build();

        return PaymentIntent.create(params);
    }

    @Transactional
    public Payment processCardPayment(String paymentIntentId, Long reservaId,
            BigDecimal amount) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Payment payment = new Payment();
        payment.setMonto(amount);
        payment.setMetodoPago(Payment.MetodoPago.TARJETA);
        payment.setEstado(Payment.EstadoPago.COMPLETADO);
        payment.setReserva(reserva);
        payment.setStripePaymentIntentId(paymentIntentId);

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment processCashPayment(Long reservaId, BigDecimal amount) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Payment payment = new Payment();
        payment.setMonto(amount);
        payment.setMetodoPago(Payment.MetodoPago.EFECTIVO);
        payment.setEstado(Payment.EstadoPago.PENDIENTE);
        payment.setReserva(reserva);

        return paymentRepository.save(payment);
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public Payment findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    }

    public List<Payment> findByReserva(Long reservaId) {
        return paymentRepository.findByReservaIdReserva(reservaId);
    }

    @Transactional
    public void cancelPayment(Long id) {
        Payment payment = findById(id);
        payment.setEstado(Payment.EstadoPago.CANCELADO);
        paymentRepository.save(payment);
    }
}

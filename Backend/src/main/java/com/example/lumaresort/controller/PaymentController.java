package com.example.lumaresort.controller;

import com.example.lumaresort.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.lumaresort.dto.PaymentIntentRequest;
import com.example.lumaresort.dto.PaymentIntentResponse;
import com.example.lumaresort.dto.PaymentRequest;
import com.example.lumaresort.dto.PaymentResponse;
import com.example.lumaresort.entities.Payment;

@RestController
@RequestMapping("/api/pagos")

public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @RequestBody PaymentIntentRequest request) {
        try {
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(
                    request.getAmount(), request.getReservaId());

            PaymentIntentResponse response = new PaymentIntentResponse();
            response.setClientSecret(paymentIntent.getClientSecret());
            response.setPaymentIntentId(paymentIntent.getId());
            response.setAmount(paymentIntent.getAmount());
            response.setCurrency(paymentIntent.getCurrency());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/process-card")
    public ResponseEntity<PaymentResponse> processCardPayment(
            @RequestBody PaymentRequest request) {
        try {
            Payment payment = paymentService.processCardPayment(
                    request.getPaymentIntentId(),
                    request.getReservaId(),
                    request.getAmount());

            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setMessage("Pago procesado exitosamente");
            response.setPayment(payment);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(false);
            response.setError(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/process-cash")
    public ResponseEntity<PaymentResponse> processCashPayment(
            @RequestBody PaymentRequest request) {
        try {
            Payment payment = paymentService.processCashPayment(
                    request.getReservaId(),
                    request.getAmount());

            PaymentResponse response = new PaymentResponse();
            response.setSuccess(true);
            response.setMessage("Pago en efectivo registrado");
            response.setPayment(payment);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PaymentResponse response = new PaymentResponse();
            response.setSuccess(false);
            response.setError(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<Payment>> findAll() {
        return ResponseEntity.ok(paymentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> findById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.findById(id));
    }

    @GetMapping("/reserva/{reservaId}")
    public ResponseEntity<List<Payment>> findByReserva(@PathVariable Long reservaId) {
        return ResponseEntity.ok(paymentService.findByReserva(reservaId));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelPayment(@PathVariable Long id) {
        paymentService.cancelPayment(id);
        return ResponseEntity.ok().build();
    }
}

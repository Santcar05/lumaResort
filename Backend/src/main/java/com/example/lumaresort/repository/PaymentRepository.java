package com.example.lumaresort.repository;

import com.example.lumaresort.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByReservaIdReserva(Long reservaId);

    List<Payment> findByEstado(Payment.EstadoPago estado);

    Payment findByStripePaymentIntentId(String paymentIntentId);
}

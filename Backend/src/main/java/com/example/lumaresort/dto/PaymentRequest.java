package com.example.lumaresort.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private String paymentIntentId;
    private Long reservaId;
    private BigDecimal amount;
    private String metodoPago;

    // Getters and Setters
}

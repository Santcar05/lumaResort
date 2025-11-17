package com.example.lumaresort.dto;

import com.example.lumaresort.entities.Payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private boolean success;
    private String message;
    private Payment payment;
    private String error;

    // Getters and Setters
}

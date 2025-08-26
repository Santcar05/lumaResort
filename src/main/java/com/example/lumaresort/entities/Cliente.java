package com.example.lumaresort.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private String tipoHabitacion;

    private String estadoReserva; // En uso, Paga, Pendiente
}

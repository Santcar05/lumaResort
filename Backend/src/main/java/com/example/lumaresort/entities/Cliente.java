package com.example.lumaresort.entities;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    private String nombre;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String tipoHabitacion;
    private String estadoReserva; // En uso, Paga, Pendiente

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;
}

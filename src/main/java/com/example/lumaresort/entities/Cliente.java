package com.example.lumaresort.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    private Integer idCliente;
    private Usuario usuario;
    private List<Reserva> reservas;
}

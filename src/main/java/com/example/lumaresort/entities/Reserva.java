package com.example.lumaresort.entities;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    private Integer idReserva;
    private Date fechaInicio;
    private Date fechaFin;
    private Integer cantidadPersonas;
    private String estado;

    private Cliente cliente;
}

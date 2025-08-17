package com.example.lumaresort.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habitacion {

    private Integer idHabitacion;
    private String numero;
    private float precioPorNoche;
    private String estado;

    private TipoHabitacion tipoHabitacion;
    private CuentaHabitacion cuentaHabitacion;
}

package com.example.lumaresort.entities;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servicio {

    private Integer idServicio;
    private String nombre;
    private String descripcion;
    private float precio;

    private CuentaHabitacion cuentaHabitacion;
}

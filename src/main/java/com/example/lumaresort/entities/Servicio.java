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
public class Servicio {

    private Integer idServicio;
    private String nombre;
    private String descripcion;
    private float precio;
    private String imagenURL;

    private List<Comentario> comentarios;
    private CuentaHabitacion cuentaHabitacion;
}

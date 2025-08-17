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
public class Historial {

    private Integer idHistorial;
    private Date fecha;
    private String resumen;
    private Usuario usuario;
}

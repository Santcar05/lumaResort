package com.example.lumaresort.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetodoPago {

    private Integer idMetodo;
    private String nombre;
}

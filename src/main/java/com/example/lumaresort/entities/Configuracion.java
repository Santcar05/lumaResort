package com.example.lumaresort.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Configuracion {

    private Integer id;
    private boolean notificacionesActivas;
    private String idioma;
    private TemaVisual temaVisual;

    public enum TemaVisual {
        CLARO, OSCURO, AUTOMATICO
    }
}

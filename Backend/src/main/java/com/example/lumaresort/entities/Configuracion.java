package com.example.lumaresort.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private boolean notificacionesActivas;

    private String idioma;

    @Enumerated(EnumType.STRING) // Guarda el nombre del enum en lugar del número
    private TemaVisual temaVisual;

    @OneToOne
    @JoinColumn(name = "idUsuario") // clave foránea
    private Usuario usuario;

    public enum TemaVisual {
        CLARO, OSCURO, AUTOMATICO
    }
}

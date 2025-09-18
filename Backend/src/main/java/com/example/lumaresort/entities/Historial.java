package com.example.lumaresort.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Historial {

    @Id
    @GeneratedValue
    private Integer idHistorial;

    private Date fecha;
    private String resumen;

    @ManyToOne
    private Usuario usuario;
}

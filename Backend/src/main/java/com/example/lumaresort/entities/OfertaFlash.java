package com.example.lumaresort.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ofertas_flash")
public class OfertaFlash {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descripcion;

    private String tipoOferta; 

    private Integer porcentajeDescuento;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    private Boolean activa;

    private String color; 

    private String icono; 

    public OfertaFlash(String titulo, String descripcion, String tipoOferta, Integer porcentajeDescuento,
            LocalDateTime fechaInicio, LocalDateTime fechaFin, String color, String icono) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipoOferta = tipoOferta;
        this.porcentajeDescuento = porcentajeDescuento;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.activa = true;
        this.color = color;
        this.icono = icono;
    }

    public boolean estaActiva() {
        if (!activa) return false;
        LocalDateTime ahora = LocalDateTime.now();
        return ahora.isAfter(fechaInicio) && ahora.isBefore(fechaFin);
    }
}

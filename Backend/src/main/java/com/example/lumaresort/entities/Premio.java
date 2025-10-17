package com.example.lumaresort.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
public class Premio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String descripcion;

    private String color;

    private String icono;

    // muchos premios pueden ser ganados por un usuario
    @JsonIgnoreProperties({"reservas", "historial", "cliente", "administrador", "operador", "premios"})
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // muchos premios pueden estar asociados a una reserva
    @JsonIgnoreProperties({"servicios", "usuario", "habitacion", "premio"})
    @ManyToOne
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;

    public Premio(String nombre, String descripcion, String color, String icono) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.color = color;
        this.icono = icono;
    }
}

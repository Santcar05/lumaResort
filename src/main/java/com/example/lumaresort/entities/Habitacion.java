package com.example.lumaresort.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
@Entity
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHabitacion;

    private String numero;
    private float precioPorNoche;
    private String estado;
    private Integer capacidad;
    private String descripcion;
    private List<String> imagenUrl;

    // Muchas habitaciones pueden ser de un tipo
    @ManyToOne
    @JoinColumn(name = "idTipoHabitacion") // FK hacia TipoHabitacion
    private TipoHabitacion tipoHabitacion;

    // Una habitación está asociada a una sola cuenta
    @OneToOne
    @JoinColumn(name = "idCuentaHabitacion") // FK hacia CuentaHabitacion
    private CuentaHabitacion cuentaHabitacion;

    public Habitacion() {

    }
//Constructor sin idHabitacion

    public Habitacion(String numero, float precioPorNoche, String estado, Integer capacidad, String descripcion, List<String> imagenUrl, TipoHabitacion tipoHabitacion) {
        this.numero = numero;
        this.precioPorNoche = precioPorNoche;
        this.estado = estado;
        this.capacidad = capacidad;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.tipoHabitacion = tipoHabitacion;
    }
}

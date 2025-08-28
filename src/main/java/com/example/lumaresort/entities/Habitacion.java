package com.example.lumaresort.entities;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

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
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHabitacion;

    private String numero;
    private float precioPorNoche;
    private String estado;
    private Integer capacidad;
    private String descripcion;
    private List<String> imagenUrl;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date checkinDesde;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date checkoutHasta;

    // Muchas habitaciones pueden ser de un tipo
    @ManyToOne
    @JoinColumn(name = "idTipoHabitacion") // FK hacia TipoHabitacion
    private TipoHabitacion tipoHabitacion;

    // Una habitación está asociada a una sola cuenta
    @OneToOne
    @JoinColumn(name = "idCuentaHabitacion") // FK hacia CuentaHabitacion
    private CuentaHabitacion cuentaHabitacion;
}

package com.example.lumaresort.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idServicio;

    private String nombre;
    private String descripcion;
    private float precio;
    private String imagenURL;

    // Un servicio puede tener varios comentarios
    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios;

    // Muchos servicios pueden estar asociados a una cuenta de habitación
    @ManyToOne
    @JoinColumn(name = "id_cuenta_habitacion", nullable = false)
    private CuentaHabitacion cuentaHabitacion;
}

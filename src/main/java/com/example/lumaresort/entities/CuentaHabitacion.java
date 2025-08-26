package com.example.lumaresort.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
public class CuentaHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCuentaHabitacion;

    private float total;

    // Una cuenta puede estar asociada a varias habitaciones
    @ManyToMany
    @JoinTable(
            name = "cuenta_habitacion_habitacion",
            joinColumns = @JoinColumn(name = "idCuentaHabitacion"),
            inverseJoinColumns = @JoinColumn(name = "idHabitacion")
    )
    private List<Habitacion> habitaciones;

    // Una cuenta puede estar asociada a varios servicios
    @ManyToMany
    @JoinTable(
            name = "cuenta_habitacion_servicio",
            joinColumns = @JoinColumn(name = "idCuentaHabitacion"),
            inverseJoinColumns = @JoinColumn(name = "idServicio")
    )
    private List<Servicio> servicios;

    // Una cuenta puede tener varios pagos
    @OneToMany(mappedBy = "cuentaHabitacion", cascade = CascadeType.ALL)
    private List<Pago> pagos;
}

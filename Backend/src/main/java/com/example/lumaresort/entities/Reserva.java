package com.example.lumaresort.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReserva;

    @Temporal(TemporalType.DATE) // o TIMESTAMP si quieres fecha y hora
    private Date fechaInicio;

    @Temporal(TemporalType.DATE)
    private Date fechaFin;

    private Integer cantidadPersonas;

    private String estado;

    // Relación con Cliente: muchas reservas pueden pertenecer a un cliente
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Usuario cliente;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "habitacion_id")
    private Habitacion habitacion;

    //Conjunto de servicios
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "reserva_servicio",
            joinColumns = @JoinColumn(name = "reserva_id"), // FK hacia esta entidad
            inverseJoinColumns = @JoinColumn(name = "servicio_id") // FK hacia la entidad Servicio
    )
    private List<Servicio> servicios;

    public Reserva(Date fechaInicio, Date fechaFin, Integer cantidadPersonas, String estado, Usuario cliente, Habitacion habitacion) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.cliente = cliente;
        this.habitacion = habitacion;
        this.servicios = new ArrayList<>();
    }

    public Reserva(Date fechaInicio, Date fechaFin, Integer cantidadPersonas, String estado, Usuario cliente, Habitacion habitacion, List<Servicio> servicios) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.cliente = cliente;
        this.habitacion = habitacion;
        this.servicios = servicios;
    }

}

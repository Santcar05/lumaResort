package com.example.lumaresort.entities;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    private String nombre;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private String tipoHabitacion;

    private String estadoReserva; // En uso, Paga, Pendiente

    @OneToOne
    @JoinColumn(name = "idUsuario") // FK en tabla Cliente
    private Usuario usuario;

    public Cliente() {

    }

    //Todos los parametros menos id
    public Cliente(String nombre, LocalDate checkIn, LocalDate checkOut, String tipoHabitacion) {
        this.nombre = nombre;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.tipoHabitacion = tipoHabitacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public String getTipoHabitacion() {
        return tipoHabitacion;
    }

    public void setTipoHabitacion(String tipoHabitacion) {
        this.tipoHabitacion = tipoHabitacion;
    }

}

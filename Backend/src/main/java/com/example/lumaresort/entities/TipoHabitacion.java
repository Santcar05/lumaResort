package com.example.lumaresort.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class TipoHabitacion {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private String descripcion;

    private List<String> imagenes; // URL o path de la imagen representativa

    private List<String> caracteristicas; // Descripción de las características del tipo de habitación
    private Double precio; // Precio por noche

    @JsonIgnore
    @OneToMany(mappedBy = "tipoHabitacion")
    private List<Habitacion> habitaciones = new ArrayList<>();

    public TipoHabitacion() {
    }

    public TipoHabitacion(String nombre, String descripcion, List<String> imagenes, List<String> caracteristicas, Double precio) {
        this.precio = precio;
        this.imagenes = imagenes;
        this.caracteristicas = caracteristicas;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<Habitacion> getHabitaciones() {
        return habitaciones;
    }

    public void setHabitaciones(List<Habitacion> habitaciones) {
        this.habitaciones = habitaciones;
    }

    public List<String> getCaracteristicas() {
        return caracteristicas;
    }

    public void setCaracteristicas(List<String> caracteristicas) {
        this.caracteristicas = caracteristicas;
    }

    public List<String> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<String> imagenes) {
        this.imagenes = imagenes;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }
}

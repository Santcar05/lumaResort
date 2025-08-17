package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Habitacion;

@Repository
public class HabitacionRepository {

    private List<Habitacion> habitaciones = new ArrayList<>();

    public HabitacionRepository() {
        initData();
    }

    private void initData() {
        habitaciones.add(new Habitacion(1, "101", 100.0f, null, null, null));
        habitaciones.add(new Habitacion(2, "102", 120.0f, null, null, null));
        habitaciones.add(new Habitacion(3, "201", 150.0f, null, null, null));
        habitaciones.add(new Habitacion(4, "202", 180.0f, null, null, null));
        habitaciones.add(new Habitacion(5, "301", 200.0f, null, null, null));
    }

    public List<Habitacion> findAll() {
        return habitaciones;
    }

    public Habitacion findById(int id) {
        return habitaciones.stream().filter(h -> h.getIdHabitacion() == id).findFirst().orElse(null);
    }

    public void save(Habitacion h) {
        habitaciones.add(h);
    }
}

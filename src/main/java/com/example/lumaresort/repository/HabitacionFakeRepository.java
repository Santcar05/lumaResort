package com.example.lumaresort.repository;

import java.util.*;

import org.springframework.stereotype.Component;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.TipoHabitacion;

@Component
public class HabitacionFakeRepository {

    private Map<Integer, Habitacion> habitaciones = new HashMap<>();

    public HabitacionFakeRepository() {
        initFakeData();
    }

    private void initFakeData() {
        habitaciones.put(1, Habitacion.builder()
                .numero("101").precioPorNoche(100.0f).estado("Disponible")
                .tipoHabitacion(TipoHabitacion.builder().idTipo(1).nombre("Simple").descripcion("Habitación sencilla").build())
                .build());

        // ... demás habitaciones ...
    }

    public List<Habitacion> findAll() {
        return new ArrayList<>(habitaciones.values());
    }

    public Habitacion findById(int id) {
        return habitaciones.get(id);
    }

    public void save(Habitacion h) {
        habitaciones.put(h.getIdHabitacion(), h);
    }

    public void update(Habitacion h) {
        habitaciones.put(h.getIdHabitacion(), h);
    }
}

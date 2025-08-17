package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Habitacion;
import com.example.lumaresort.entities.TipoHabitacion;

@Repository
public final class HabitacionRepository {

    private Map<Integer, Habitacion> habitaciones = new HashMap<>();

    public HabitacionRepository() {
        initFakeData();
    }

    public void initFakeData() {
        habitaciones.put(1, Habitacion.builder().numero("101").precioPorNoche(100.0f).estado("Disponible").tipoHabitacion(TipoHabitacion.builder().idTipo(1).nombre("Simple").descripcion("Habitación sencilla").build()).build());
        habitaciones.put(2, Habitacion.builder().numero("201").precioPorNoche(250.0f).estado("Ocupada").tipoHabitacion(TipoHabitacion.builder().idTipo(2).nombre("Doble").descripcion("Habitación para dos personas").build()).build());
        habitaciones.put(3, Habitacion.builder().numero("301").precioPorNoche(170.0f).estado("Mantenimiento").tipoHabitacion(TipoHabitacion.builder().idTipo(3).nombre("Suite").descripcion("Habitación de lujo").build()).build());
        habitaciones.put(4, Habitacion.builder().numero("401").precioPorNoche(220.0f).estado("Disponible").tipoHabitacion(TipoHabitacion.builder().idTipo(4).nombre("Familiar").descripcion("Habitación amplia para familias").build()).build());
        habitaciones.put(5, Habitacion.builder().numero("801").precioPorNoche(180.0f).estado("Mantenimiento").tipoHabitacion(TipoHabitacion.builder().idTipo(3).nombre("Suite").descripcion("Habitación de lujo").build()).build());
        habitaciones.put(6, Habitacion.builder().numero("901").precioPorNoche(150.0f).estado("Disponible").tipoHabitacion(TipoHabitacion.builder().idTipo(4).nombre("Familiar").descripcion("Habitación amplia para familias").build()).build());
        habitaciones.put(7, Habitacion.builder().numero("1001").precioPorNoche(400.0f).estado("Ocupada").tipoHabitacion(TipoHabitacion.builder().idTipo(5).nombre("Presidencial").descripcion("Habitación premium").build()).build());
        habitaciones.put(8, Habitacion.builder().numero("1101").precioPorNoche(280.0f).estado("Disponible").tipoHabitacion(TipoHabitacion.builder().idTipo(1).nombre("Simple").descripcion("Habitación sencilla").build()).build());
        habitaciones.put(9, Habitacion.builder().numero("1201").precioPorNoche(320.0f).estado("Ocupada").tipoHabitacion(TipoHabitacion.builder().idTipo(2).nombre("Doble").descripcion("Habitación para dos personas").build()).build());
        habitaciones.put(10, Habitacion.builder().numero("1301").precioPorNoche(210.0f).estado("Mantenimiento").tipoHabitacion(TipoHabitacion.builder().idTipo(3).nombre("Suite").descripcion("Habitación de lujo").build()).build());
        habitaciones.put(11, Habitacion.builder().numero("1401").precioPorNoche(130.0f).estado("Disponible").tipoHabitacion(TipoHabitacion.builder().idTipo(4).nombre("Familiar").descripcion("Habitación amplia para familias").build()).build());
        habitaciones.put(12, Habitacion.builder().numero("1501").precioPorNoche(390.0f).estado("Ocupada").tipoHabitacion(TipoHabitacion.builder().idTipo(5).nombre("Presidencial").descripcion("Habitación premium").build()).build());

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
}

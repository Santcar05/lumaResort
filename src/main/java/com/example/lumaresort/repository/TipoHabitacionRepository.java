package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.TipoHabitacion;

@Repository
public class TipoHabitacionRepository {

    private List<TipoHabitacion> tipos = new ArrayList<>();

    public TipoHabitacionRepository() {
        initData();
    }

    private void initData() {
        tipos.add(new TipoHabitacion(1, "Simple", "Habitación sencilla"));
        tipos.add(new TipoHabitacion(2, "Doble", "Habitación para dos personas"));
        tipos.add(new TipoHabitacion(3, "Suite", "Habitación de lujo"));
        tipos.add(new TipoHabitacion(4, "Familiar", "Habitación amplia para familias"));
        tipos.add(new TipoHabitacion(5, "Presidencial", "Habitación premium"));
    }

    public List<TipoHabitacion> findAll() {
        return tipos;
    }

    public TipoHabitacion findById(int id) {
        return tipos.stream().filter(t -> t.getIdTipo() == id).findFirst().orElse(null);
    }

    public void save(TipoHabitacion t) {
        tipos.add(t);
    }
}

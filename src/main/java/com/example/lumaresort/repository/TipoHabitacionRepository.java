package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.TipoHabitacion;

@Repository
public class TipoHabitacionRepository {

    private Map<Integer, TipoHabitacion> tipos = new HashMap<>();

    public TipoHabitacionRepository() {
        initData();
    }

    private void initData() {
        tipos.put(1, new TipoHabitacion(1, "Simple", "Habitación sencilla"));
        tipos.put(2, new TipoHabitacion(2, "Doble", "Habitación para dos personas"));
        tipos.put(3, new TipoHabitacion(3, "Suite", "Habitación de lujo"));
        tipos.put(4, new TipoHabitacion(4, "Familiar", "Habitación amplia para familias"));
        tipos.put(5, new TipoHabitacion(5, "Presidencial", "Habitación premium"));
    }

    public List<TipoHabitacion> findAll() {
        return new ArrayList<>(tipos.values());
    }

    public TipoHabitacion findById(int id) {
        return tipos.get(id);
    }

    public TipoHabitacion save(TipoHabitacion tipo) {
        tipos.put(tipo.getIdTipo(), tipo);
        return tipo;
    }

    public void delete(int id) {
        tipos.remove(id);
    }

    public void update(TipoHabitacion tipo) {
        tipos.put(tipo.getIdTipo(), tipo);
    }

}

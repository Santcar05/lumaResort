package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Historial;

@Repository
public class HistorialRepository {

    private final Map<Integer, Historial> historiales;

    public HistorialRepository() {
        this.historiales = new HashMap<>();
        initData();
    }

    private void initData() {
        historiales.put(1, new Historial(1, new Date(), "Ingreso al sistema", null));
        historiales.put(2, new Historial(2, new Date(), "Reserva realizada", null));
        historiales.put(3, new Historial(3, new Date(), "Pago confirmado", null));
        historiales.put(4, new Historial(4, new Date(), "Modificación de reserva", null));
        historiales.put(5, new Historial(5, new Date(), "Cierre de sesión", null));
    }

    public List<Historial> findAll() {
        return new ArrayList<>(historiales.values());
    }

    public Historial findById(int id) {
        return historiales.get(id);
    }

    public void save(Historial historial) {
        historiales.put(historial.getIdHistorial(), historial);
    }

    public void delete(int id) {
        historiales.remove(id);
    }
}

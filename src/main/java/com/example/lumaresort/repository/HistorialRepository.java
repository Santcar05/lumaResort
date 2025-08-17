package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Historial;

@Repository
public class HistorialRepository {

    private List<Historial> historiales = new ArrayList<>();

    public HistorialRepository() {
        initData();
    }

    private void initData() {
        historiales.add(new Historial(1, new Date(), "Ingreso al sistema", null));
        historiales.add(new Historial(2, new Date(), "Reserva realizada", null));
        historiales.add(new Historial(3, new Date(), "Pago confirmado", null));
        historiales.add(new Historial(4, new Date(), "Modificación de reserva", null));
        historiales.add(new Historial(5, new Date(), "Cierre de sesión", null));
    }

    public List<Historial> findAll() {
        return historiales;
    }

    public Historial findById(int id) {
        return historiales.stream().filter(h -> h.getIdHistorial() == id).findFirst().orElse(null);
    }

    public void save(Historial h) {
        historiales.add(h);
    }
}

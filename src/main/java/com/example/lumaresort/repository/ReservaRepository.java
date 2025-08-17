package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Reserva;

@Repository
public class ReservaRepository {

    private List<Reserva> reservas = new ArrayList<>();

    public ReservaRepository() {
        initData();
    }

    private void initData() {
        reservas.add(new Reserva(1, new Date(), new Date(), 2, null, null));
        reservas.add(new Reserva(2, new Date(), new Date(), 3, null, null));
        reservas.add(new Reserva(3, new Date(), new Date(), 1, null, null));
        reservas.add(new Reserva(4, new Date(), new Date(), 4, null, null));
        reservas.add(new Reserva(5, new Date(), new Date(), 2, null, null));
    }

    public List<Reserva> findAll() {
        return reservas;
    }

    public Reserva findById(int id) {
        return reservas.stream().filter(r -> r.getIdReserva() == id).findFirst().orElse(null);
    }

    public void save(Reserva r) {
        reservas.add(r);
    }
}

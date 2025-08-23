package com.example.lumaresort.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Reserva;

@Repository
public class ReservaRepository {

    private Map<Integer, Reserva> reservas = new HashMap<>();

    public ReservaRepository() {
        initData();
    }

    public void initData() {
        /*Atributos:
         *     private Integer idReserva;
    private Date fechaInicio;
    private Date fechaFin;
    private Integer cantidadPersonas;
    private String estado;
    private Cliente cliente;
         */
        reservas.put(1, new Reserva(1, new Date(), new Date(), 2, "Confirmada", null));
        reservas.put(2, new Reserva(2, new Date(), new Date(), 4, "Confirmada", null));
        reservas.put(3, new Reserva(3, new Date(), new Date(), 6, "Confirmada", null));
        reservas.put(4, new Reserva(4, new Date(), new Date(), 8, "Confirmada", null));
        reservas.put(5, new Reserva(5, new Date(), new Date(), 10, "Confirmada", null));
    }

}

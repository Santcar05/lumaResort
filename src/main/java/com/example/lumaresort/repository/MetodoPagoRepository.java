package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.MetodoPago;

@Repository
public class MetodoPagoRepository {

    private Map<Integer, MetodoPago> metodos = new HashMap<>();

    public MetodoPagoRepository() {
        initData();
    }

    private void initData() {
        metodos.put(1, new MetodoPago(1, "Efectivo"));
        metodos.put(2, new MetodoPago(2, "Tarjeta de Crédito"));
        metodos.put(3, new MetodoPago(3, "Tarjeta de Débito"));
        metodos.put(4, new MetodoPago(4, "Transferencia Bancaria"));
        metodos.put(5, new MetodoPago(5, "PayPal"));
    }

    public List<MetodoPago> findAll() {
        return new ArrayList<>(metodos.values());
    }

    public MetodoPago findById(int id) {
        return metodos.get(id);
    }

    public void save(MetodoPago metodo) {
        metodos.put(metodo.getIdMetodo(), metodo);
    }

    public void delete(int id) {
        metodos.remove(id);
    }

    public void update(MetodoPago metodo) {
        metodos.put(metodo.getIdMetodo(), metodo);
    }

}

package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.MetodoPago;

@Repository
public class MetodoPagoRepository {

    private List<MetodoPago> metodos = new ArrayList<>();

    public MetodoPagoRepository() {
        initData();
    }

    private void initData() {
        metodos.add(new MetodoPago(1, "Efectivo"));
        metodos.add(new MetodoPago(2, "Tarjeta de Crédito"));
        metodos.add(new MetodoPago(3, "Tarjeta de Débito"));
        metodos.add(new MetodoPago(4, "Transferencia Bancaria"));
        metodos.add(new MetodoPago(5, "PayPal"));
    }

    public List<MetodoPago> findAll() {
        return metodos;
    }

    public MetodoPago findById(int id) {
        return metodos.stream().filter(m -> m.getIdMetodo() == id).findFirst().orElse(null);
    }

    public void save(MetodoPago m) {
        metodos.add(m);
    }
}

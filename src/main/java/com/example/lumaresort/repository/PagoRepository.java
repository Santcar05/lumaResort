package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.MetodoPago;
import com.example.lumaresort.entities.Pago;

@Repository
public class PagoRepository {

    private Map<Integer, Pago> pagos = new HashMap<>();

    public PagoRepository() {
        initData();
    }

    private void initData() {
        pagos.put(1, new Pago(1, 10.0f, new Date(), "En proceso", null, new MetodoPago(1, "Efectivo")));
        pagos.put(2, new Pago(2, 20.0f, new Date(), "Realizado", null, new MetodoPago(2, "Tarjeta de Crédito")));
        pagos.put(3, new Pago(3, 30.0f, new Date(), "Realizado", null, new MetodoPago(3, "Tarjeta de Débito")));
        pagos.put(4, new Pago(4, 40.0f, new Date(), "Rechazado", null, new MetodoPago(4, "Transferencia Bancaria")));
        pagos.put(5, new Pago(5, 50.0f, new Date(), "En proceso", null, new MetodoPago(5, "PayPal")));
    }

    public List<Pago> findAll() {
        return new ArrayList<>(pagos.values());
    }

    public Pago findById(int id) {
        return pagos.get(id);
    }

    public Pago save(Pago pago) {
        pagos.put(pago.getIdPago(), pago);
        return pago;
    }

    public void delete(int id) {
        pagos.remove(id);
    }

}

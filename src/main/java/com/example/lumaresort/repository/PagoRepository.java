package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Pago;

@Repository
public class PagoRepository {

    private Map<Integer, Pago> pagos = new HashMap<>();

    public PagoRepository() {
        initData();
    }

    private void initData() {
        pagos.put(1, new Pago(1, 10.0f, null, null, null, null));
        pagos.put(2, new Pago(2, 20.0f, null, null, null, null));
        pagos.put(3, new Pago(3, 30.0f, null, null, null, null));
        pagos.put(4, new Pago(4, 40.0f, null, null, null, null));
        pagos.put(5, new Pago(5, 50.0f, null, null, null, null));
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

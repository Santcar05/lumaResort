package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Pago;

@Repository
public class PagoRepository {

    private final List<Pago> pagos;

    public PagoRepository() {
        this.pagos = new ArrayList<>();
        initData();
    }

    private void initData() {
        pagos.add(new Pago(1, 100.0f, new Date(), null, null, null));
        pagos.add(new Pago(2, 150.0f, new Date(), null, null, null));
        pagos.add(new Pago(3, 200.0f, new Date(), null, null, null));
        pagos.add(new Pago(4, 300.0f, new Date(), null, null, null));
        pagos.add(new Pago(5, 400.0f, new Date(), null, null, null));
    }

    public List<Pago> findAll() {
        return pagos;
    }

    public Pago findById(int id) {
        return pagos.stream().filter(p -> p.getIdPago() == id).findFirst().orElse(null);
    }

    public void save(Pago p) {
        pagos.add(p);
    }
}

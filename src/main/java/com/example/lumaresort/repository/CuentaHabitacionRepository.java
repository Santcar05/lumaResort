package com.example.lumaresort.repository;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.CuentaHabitacion;

@Repository
public class CuentaHabitacionRepository {

    private Map<Integer, CuentaHabitacion> cuentas = new HashMap<>();

    public CuentaHabitacionRepository() {
        initData();
    }

    private void initData() {
        cuentas.put(1, new CuentaHabitacion(1, 100.0f, null, null, null));
        cuentas.put(2, new CuentaHabitacion(2, 200.0f, null, null, null));
        cuentas.put(3, new CuentaHabitacion(3, 300.0f, null, null, null));
        cuentas.put(4, new CuentaHabitacion(4, 400.0f, null, null, null));
        cuentas.put(5, new CuentaHabitacion(5, 500.0f, null, null, null));
    }

    public Iterable<CuentaHabitacion> findAll() {
        return cuentas.values();
    }

    public CuentaHabitacion findById(int id) {
        return cuentas.get(id);
    }

    public CuentaHabitacion save(CuentaHabitacion cuenta) {
        cuentas.put(cuenta.getIdCuentaHabitacion(), cuenta);
        return cuenta;
    }

    public void delete(int id) {
        cuentas.remove(id);
    }

    public void update(CuentaHabitacion cuenta) {
        cuentas.put(cuenta.getIdCuentaHabitacion(), cuenta);
    }

}

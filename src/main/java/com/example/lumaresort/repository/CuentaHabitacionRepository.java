package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.CuentaHabitacion;

@Repository
public class CuentaHabitacionRepository {

    private List<CuentaHabitacion> cuentas = new ArrayList<>();

    public CuentaHabitacionRepository() {
        initData();
    }

    private void initData() {
        cuentas.add(new CuentaHabitacion(1, 200.0f, new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));
        cuentas.add(new CuentaHabitacion(2, 350.0f, new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));
        cuentas.add(new CuentaHabitacion(3, 150.0f, new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));
        cuentas.add(new CuentaHabitacion(4, 500.0f, new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));
        cuentas.add(new CuentaHabitacion(5, 420.0f, new ArrayList<>(), new ArrayList<>(), new ArrayList<>()));
    }

    public List<CuentaHabitacion> findAll() {
        return cuentas;
    }

    public CuentaHabitacion findById(int id) {
        return cuentas.stream().filter(c -> c.getIdCuentaHabitacion() == id).findFirst().orElse(null);
    }

    public void save(CuentaHabitacion c) {
        cuentas.add(c);
    }
}

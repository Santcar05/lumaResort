package com.example.lumaresort.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.lumaresort.entities.Servicio;

@Repository
public class ServicioRepository {

    private List<Servicio> servicios = new ArrayList<>();

    public ServicioRepository() {
        initData();
    }

    private void initData() {
        servicios.add(new Servicio(1, "Spa", "Servicio de relajación", 80.0f, null));
        servicios.add(new Servicio(2, "Restaurante", "Comida gourmet", 50.0f, null));
        servicios.add(new Servicio(3, "Transporte", "Traslados al aeropuerto", 30.0f, null));
        servicios.add(new Servicio(4, "Gimnasio", "Acceso al gimnasio", 20.0f, null));
        servicios.add(new Servicio(5, "Piscina", "Acceso a piscina privada", 40.0f, null));
    }

    public List<Servicio> findAll() {
        return servicios;
    }

    public Servicio findById(int id) {
        return servicios.stream().filter(s -> s.getIdServicio() == id).findFirst().orElse(null);
    }

    public void save(Servicio s) {
        servicios.add(s);
    }
}
